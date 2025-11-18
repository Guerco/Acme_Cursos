<?php

class Validador {
    /**
     * Valida um array de dados baseado em um esquema
     *
     * @param array<string,mixed> $dados
     * 
     * @param array<
     *  string, array{
     *      tipo: string|TiposCampos,
     *      obrigatorio?: bool,
     *      subcampos?: array<string, mixed>,
     *      valoresEnum?: string[],
     *      tipoArray?: string|TiposCampos,
     *  }
     * > $schema
     * 
     * @return string[]
     */
    public static function validarArraySchema(array $dados, array $schema): array {
        $problemas = [];
        
        foreach ($schema as $campo => $opcoes) {
            $obrigatorio = $opcoes['obrigatorio'] ?? false;
            $tipo = $opcoes['tipo'];
            if ($tipo instanceof TiposCampos) $tipo = $tipo->value;
            $tipoArray = $opcoes['tipoArray'] ?? '';
            if ($tipoArray instanceof TiposCampos) $tipoArray = $tipoArray->value;
            $subcampos = $opcoes['subcampos'] ?? null;
            $valoresEnum = $opcoes['valoresEnum'] ?? null;
            $item = $dados[$campo] ?? null;

            if (
                $obrigatorio && $item === null
            ) {
                $problemas[] = ("Preencha o campo '{$campo}'.");
                continue;
            }

            if ( 
                $item !== null 
                && ! self::validarFormato($item, $tipo) 
            ){
                $problemas[] = ("O campo '{$campo}' deve ser do tipo '{$tipo}'.");
            }

            if ( 
                $tipo == TiposCampos::ENUM->value 
                && $valoresEnum !== null 
                && $item !== null 
            ) {
                if (
                    !self::validarFormato($item, TiposCampos::STRING)
                ) {
                    $problemas[] = "O campo '{$campo}' deve ser do tipo 'string'.";
                } 
                else {
                    $valoresEnumMinusculo = array_map('strtolower', $valoresEnum);
                    if (
                        ! in_array(strtolower($item), $valoresEnumMinusculo) 
                    )
                        $problemas[] = "O campo '{$campo}' deve ser ['" . implode("', '", $valoresEnum) . "'].";
                }
            } else if ( 
                $tipo == TiposCampos::ENUM_ARRAY->value 
                && $valoresEnum !== null 
                && $item !== null 
            ) {
                if (
                    !self::validarFormato($item, TiposCampos::ARRAY)
                    && !self::validarFormato($item, TiposCampos::STRING)
                ) {
                    $problemas[] = "O campo '{$campo}' deve ser do tipo 'array' ou 'string'.";
                } else if (
                    self::validarFormato($item, TiposCampos::ARRAY)
                    && !self::validarFormatoArray($item, TiposCampos::STRING)
                ) {
                    $problemas[] = "O campo '{$campo}' deve ser uma array de 'strings'.";   
                }
                else {
                    $valoresEnumMinusculo = array_map('strtolower', $valoresEnum);

                    if (
                        self::validarFormato($item, TiposCampos::STRING) &&
                        ! in_array(strtolower($item), $valoresEnumMinusculo) 
                    )
                        $problemas[] = "O campo '{$campo}' deve ser ['" . implode("', '", $valoresEnum) . "'].";
                    else if (
                        ! empty( array_diff(
                            array_map('strtolower', $item),
                            $valoresEnumMinusculo
                        ) ) 
                    )
                        $problemas[] = "O campo '{$campo}' deve ser ['" . implode("', '", $valoresEnum) . "'].";
                }
            } else if ( 
                $tipo == TiposCampos::ARRAY->value 
            ) {
                
                if ( 
                    $tipoArray !== '' 
                ) {
                    if (
                        ! self::validarFormato( $item, TiposCampos::ARRAY ) 
                    ) {
                        $problemas[] = "O campo '{$campo}' deve ser um array.";
                        continue;
                    }
    
                    if (
                        !self::validarFormatoArray($item, $tipoArray)
                    ) {
                        $problemas[] = "Os elementos do campo '{$campo}' devem ser do tipo '{$tipoArray}'.";
                    }
                } else if ( 
                    $subcampos !== null
                ) {
                    if (
                        ! self::validarFormato( $item, TiposCampos::ARRAY ) 
                    ) {
                        $problemas[] = "O campo '{$campo}' deve ser um objeto.";
                        continue;
                    }

                    foreach ($item as $subItem) {
                        if (
                            !self::validarFormato($subItem, TiposCampos::ARRAY)
                        ) {
                            $problemas[] = "Os elementos do campo '{$campo}' devem ser objetos.";
                            continue;
                        }

                        $problemas = array_merge(
                            $problemas,
                            self::validarArraySchema($subItem, $subcampos)
                        );
                    }
                }
            } 
        }

        return $problemas;
    }
    
    public static function validarFormato(mixed $valor, string|TiposCampos $tipo): bool {
        if ($tipo instanceof TiposCampos) $tipo = $tipo->value;
        return match ($tipo) {
            TiposCampos::INT->value    => filter_var($valor, FILTER_VALIDATE_INT) !== false,
            TiposCampos::FLOAT->value  => filter_var($valor, FILTER_VALIDATE_FLOAT) !== false,
            TiposCampos::STRING->value => is_string($valor),
            TiposCampos::BOOL->value   => !is_null(filter_var($valor, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE)),
            TiposCampos::ARRAY->value  => is_array($valor),
            default => true,
        };
    }

    /**
     * @param mixed[] $array
     * @param string|TiposCampos $tipo
     * @return bool
     */
    public static function validarFormatoArray(array $array, string|TiposCampos $tipo): bool {
        foreach ($array as $valor) {
            if (!self::validarFormato($valor, $tipo)) {
                return false;
            }
        }
        return true;
    }
}