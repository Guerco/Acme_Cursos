<?php

class AssuntoListagemDTO{

    public function __construct(
        public int $id,
        public string $descricao
    ){}

    public static function deObjeto(Assunto $assunto): AssuntoListagemDTO{
        return new Self(
            $assunto->getId(),
            $assunto->getDescricao()
        );    
    }

    public static function deObjetos(array $assuntos): array{
        $assuntosDTO = [];

        foreach($assuntos as $assunto){
            $assuntosDTO[] = Self::deObjeto($assunto);
        }

        return $assuntosDTO;
    }
}