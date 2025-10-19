<?php

class PerguntaListagemDTO{

    /**
     * @param null|RespostaPerguntaListagemDTO[] $respostas
     */
    public function __construct(
        public ?int $id,
        public ?string $descricao,
        public ?string $caminhoImg,
        public ?int $tempoSeg,
        public ?string $dificuldade,
        public ?array $respostas
    ){}

    public static function deObjeto(Pergunta $pergunta): PerguntaListagemDTO {
        return new Self(
            $pergunta->getId(),
            $pergunta->getDescricao(),
            $pergunta->getCaminhoImg(),
            $pergunta->getTempoSeg(),
            $pergunta->getDificuldade()->value,
            RespostaPerguntaListagemDTO::deObjetos($pergunta->getRespostas())
        );
    }

    /**
     * @param Pergunta[] $perguntas
     * @return PerguntaListagemDTO[]
     */
    public static function deObjetos(array $perguntas): array {
        $dtos = [];

        foreach($perguntas as $p) {
            $dtos [] = Self::deObjeto($p);
        }

        return $dtos;
    }
}