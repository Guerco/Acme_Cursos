<?php

class RespostaPerguntaListagemDTO{

    public function __construct(
        public int $id,
        public string $descricao,
        public bool $correta
    ){}
    
    public static function deObjeto(RespostaPergunta $resposta) {
        return new Self(
            $resposta->getId(),
            $resposta->getDescricao(),
            $resposta->isCorreta()
        );
    }

    public static function deObjetos(array $respostas) {
        $dtos = [];

        foreach($respostas as $r) {
            $dtos [] = Self::deObjeto($r);
        }

        return $dtos;
    }
}