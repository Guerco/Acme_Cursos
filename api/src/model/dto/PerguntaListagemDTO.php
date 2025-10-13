<?php

class PerguntaListagemDTO{

    public function __construct(
        public ?int $id,
        public ?string $descricao,
        public ?string $caminhoImg,
        public ?int $tempoSeg,
        public ?string $dificuldade,
        public ?array $respostas
    ){}

    public static function deObjeto(Pergunta $pergunta) {
        return new Self(
            $pergunta->getId(),
            $pergunta->getDescricao(),
            $pergunta->getCaminhoImg(),
            $pergunta->getTempoSeg(),
            $pergunta->getDificuldade()->value,
            RespostaPerguntaListagemDTO::deObjetos($pergunta->getRespostas())
        );
    }

    public static function deObjetos(array $perguntas) {
        $dtos = [];

        foreach($perguntas as $p) {
            $dtos [] = Self::deObjeto($p);
        }

        return $dtos;
    }
}