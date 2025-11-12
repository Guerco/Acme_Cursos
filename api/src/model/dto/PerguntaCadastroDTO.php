<?php

class PerguntaCadastroDTO
{
    /**
     * @param RespostaPerguntaCadastroDTO[] $respostas
     */
    public function __construct(
        public int $idAssunto,
        public string $descricao,
        public string $dificuldade,
        public int $tempoSeg,
        public array $respostas,
        public ?string $figuraBase64
    ) {
    }

    /**
     * @param mixed|array{
     *     idAssunto?: mixed,
     *     descricao?: mixed,
     *     dificuldade?: mixed,
     *     tempoSeg?: mixed,
     *     respostas?: mixed|array{
     *         ehCorreta?: mixed,
     *         descricao?: mixed
     *     }[],
     *     figuraBase64?: mixed
     * } $dados
     *
     * @throws DominioException
     */
    public static function deArray(mixed $dados): PerguntaCadastroDTO
    {
        if (!self::validarFormatoDado($dados, 'array')) {
            throw new DominioException('Os dados devem ser enviados em forma de objeto JSON.');
        }
        self::validarFormatoDados($dados);
        return new self(
            (int) $dados['idAssunto'],
            $dados['descricao'],
            $dados['dificuldade'],
            (int) $dados['tempoSeg'],
            RespostaPerguntaCadastroDTO::deArrays($dados['respostas']),
            $dados['figuraBase64'] ?? null
        );
    }

    public function paraObjeto() : Pergunta {
        $this->validar();
        
        $respostas = [];
        foreach($this->respostas as $r) {
            $respostas[] = $r->paraObjeto();
        }

        return new Pergunta(
            0,
            new Assunto(
                null, 
                $this->idAssunto
            ),
            $this->descricao,
            null,
            $this->tempoSeg,
            Dificuldade::deString($this->dificuldade),
            $respostas
        );
    }

    /**
     * @param array{
     *     idAssunto?: mixed,
     *     descricao?: mixed,
     *     dificuldade?: mixed,
     *     tempoSeg?: mixed,
     *     respostas?: mixed|array{
     *         ehCorreta?: mixed,
     *         descricao?: mixed
     *     }[],
     *     figuraBase64?: mixed
     * } $dados
     *
     * @throws DominioException
     */
    private static function validarFormatoDados(array $dados): void
    {
        $problemas = [];

        if (!isset($dados['idAssunto'])) {
            $problemas[] = "Preencha o campo 'idAssunto'.";
        } else if (!self::validarFormatoDado($dados['idAssunto'], 'int')) {
            $problemas[] = 'Os ids devem ser inteiros.';
        }

        if (!isset($dados['descricao'])) {
            $problemas[] = "Preencha o campo 'descricao'.";
        } else if (!self::validarFormatoDado($dados['descricao'], 'string')) {
            $problemas[] = 'A descrição deve ser uma string.';
        }

        if (!isset($dados['dificuldade'])) {
            $problemas[] = "Preencha o campo 'dificuldade'.";
        } else if (!self::validarFormatoDado($dados['dificuldade'], 'string')) {
            $problemas[] = 'A dificuldade deve ser uma string.';
        }

        if (!isset($dados['tempoSeg'])) {
            $problemas[] = "Preencha o campo 'tempoSeg'.";
        } else if (!self::validarFormatoDado($dados['tempoSeg'], 'int')) {
            $problemas[] = 'O tempo em segundos deve ser inteiro.';
        }

        if (!isset($dados['respostas'])) {
            $problemas[] = "Preencha o campo 'respostas'.";
        } else if (!self::validarFormatoDado($dados['respostas'], 'array')) {
            $problemas[] = 'As respostas devem ser enviadas em array.';
        } else {
            foreach ($dados['respostas'] as $i => $resposta) {
                if (!self::validarFormatoDado($resposta, 'array')) {
                    $problemas[] = 'As respostas devem ser objetos JSON.';
                }
                if (!isset($resposta['ehCorreta']) || !isset($resposta['descricao'])) {
                    $problemas[] = "As respostas devem possuir os campos 'ehCorreta' e 'descricao'.";
                } else {
                    if (!self::validarFormatoDado($resposta['ehCorreta'], 'bool'))
                        $problemas[] = 'A resposta correta deve ser um valor booleano.';
                    if (!self::validarFormatoDado($resposta['descricao'], 'string'))
                        $problemas[] = 'A descrição da resposta deve ser uma string.';
                }
            }
        }

        if (
            isset($dados['figuraBase64'])
            && !self::validarFormatoDado($dados['figuraBase64'], 'string')
        ) {
            $problemas[] = 'A figura deve ser uma string';
        }

        if (!empty($problemas))
            throw DominioException::comProblemas($problemas);
    }
    
    private static function validarFormatoDado(mixed $dado, string $formatoEsperado): bool
    {
        switch ($formatoEsperado) {
            case 'int':
                return (filter_var($dado, FILTER_VALIDATE_INT) !== false);
            case 'string':
                return is_string($dado);
            case 'bool':
                return (!is_null(filter_var($dado, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE)));
            case 'array':
                return is_array($dado);
        }
        return false;
    }

    public function validar(): void
    {
        $problemas = [];

        $tamanhoDescricao = strlen($this->descricao);
        $dificuldade = $this->dificuldade;
        $tempoSeg = $this->tempoSeg;
        $respostas = $this->respostas;
        $figuraBase64 = $this->figuraBase64 ?: null;

        if ($tamanhoDescricao < 10 || $tamanhoDescricao > 255)
            $problemas[] = 'A descrição deve ter de 10 a 255 caracteres.';

        $dificuldadesAceitas = ['facil', 'medio', 'dificil'];
        if (!in_array(strtolower($dificuldade), $dificuldadesAceitas))
            $problemas[] = "A dificuldade deve ser 'facil', 'medio' ou 'dificil'.";

        if ($tempoSeg < 30 || $tempoSeg > 180)
            $problemas[] = 'O tempo em segundos deve ser de 30 a 180.';

        $respostasCorretas = 0;
        $qtdRespostas = 0;
        foreach ($respostas as $r) {
            $qtdRespostas++;

            $tamanhoDescricao = strlen($r->descricao);
            if ($tamanhoDescricao < 1 || $tamanhoDescricao > 200) {
                $problemas[] = 'A descrição das respostas deve ter de 1 a 200 caracteres.';
                break;
            }

            if ($r->ehCorreta) $respostasCorretas++;
        }

        if ($qtdRespostas < 2 || $qtdRespostas > 5) {
            $problemas[] = 'A pergunta deve possuir de 2 a 5 respostas.';
        } else {
            if ($respostasCorretas == 0)
                $problemas[] = 'A pergunta não pode possuir nenhuma resposta correta.';
    
            if ($respostasCorretas >= $qtdRespostas)
                $problemas[] = 'A pergunta não pode possuir todas respostas corretas.';
        }

        if (!is_null($figuraBase64)) {
            $imgData = base64_decode($figuraBase64);
            $tamanhoImgKB = strlen($imgData) / 1024;

            $infoImg = getimagesizefromstring($imgData);
            if ($infoImg === false) {
                throw new RuntimeException('Erro ao obter metadados da figura.');
            }

            [$width, $height, $tipo] = $infoImg;
            if ($tipo != IMAGETYPE_PNG && $tipo != IMAGETYPE_JPEG) {
                $problemas[] = 'A imagem deve estar nos formatos PNG ou JPEG.';
            }
            if ($tamanhoImgKB > 500) {
                $problemas[] = 'A imagem deve possuir no máximo 500KB.';
            }
        }

        if (!empty($problemas)) throw DominioException::comProblemas($problemas);
    }
}
