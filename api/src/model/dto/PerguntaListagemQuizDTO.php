<?php

class PerguntaListagemQuizDTO{

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

    public static function deObjeto(Pergunta $pergunta): PerguntaListagemQuizDTO {
        return new self(
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
     * @return PerguntaListagemQuizDTO[]
     */
    public static function deObjetos(array $perguntas): array {
        $dtos = [];

        foreach($perguntas as $p) {
            $dtos [] = self::deObjeto($p);
        }

        return $dtos;
    }
}