<?php

class RespostaPerguntaListagemDTO{

    public function __construct(
        public int $id,
        public string $descricao
    ){}
    
    public static function deObjeto(RespostaPergunta $resposta): RespostaPerguntaListagemDTO {
        return new Self(
            $resposta->getId(),
            $resposta->getDescricao()
        );
    }

    /**
     * @param RespostaPergunta[] $respostas
     * @return RespostaPerguntaListagemDTO[]
     */
    public static function deObjetos(array $respostas): array {
        $dtos = [];

        foreach($respostas as $r) {
            $dtos [] = Self::deObjeto($r);
        }

        return $dtos;
    }
}