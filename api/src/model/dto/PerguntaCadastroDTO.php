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
        return new self(
            (int) $dados['idAssunto'],
            trim($dados['descricao']),
            $dados['dificuldade'],
            (int) $dados['tempoSeg'],
            RespostaPerguntaCadastroDTO::deArrays($dados['respostas']),
            $dados['figuraBase64'] ?? null
        );
    }

    public function paraObjeto() : Pergunta {
        $respostas = [];
        foreach($this->respostas as $r) {
            $respostas[] = $r->paraObjeto();
        }

        /**
         * @var Dificuldade
         */
        $dificuldade = Dificuldade::deString($this->dificuldade);

        return new Pergunta(
            0,
            new Assunto(
                null, 
                $this->idAssunto
            ),
            $this->descricao,
            null,
            $this->tempoSeg,
            $dificuldade,
            $respostas
        );
    }
}
