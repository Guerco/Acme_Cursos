<?php

class PerguntaListagemDTO{

    /**
     * @param null|RespostaPerguntaCadastroDTO[] $respostas
     */
    public function __construct(
        public ?string $descricao,
        public ?string $caminhoImg,
        public ?int $tempoSeg,
        public ?string $dificuldade,
        public ?string $descricaoAssunto,
        public ?string $ultimaAtualizacao,
        public ?array $respostas
    ){}

    public static function deObjeto(Pergunta $pergunta): PerguntaListagemDTO {
        /**
         * @var Assunto
         */
        $assunto = $pergunta->getAssunto();
        /**
         * @var DateTime
         */
        $dataAtt = $pergunta->getUltimaAtualizacao();
        
        return new self(
            $pergunta->getDescricao(),
            $pergunta->getCaminhoImg(),
            $pergunta->getTempoSeg(),
            $pergunta->getDificuldade()->value,
            $assunto->getDescricao(),
            $dataAtt->format('d/m/Y H:i:s'),
            RespostaPerguntaCadastroDTO::deObjetos($pergunta->getRespostas())
        );
    }

    /**
     * @param Pergunta[] $perguntas
     * @return PerguntaListagemDTO[]
     */
    public static function deObjetos(array $perguntas): array {
        $dtos = [];

        foreach($perguntas as $p) {
            $dtos [] = self::deObjeto($p);
        }

        return $dtos;
    }
}