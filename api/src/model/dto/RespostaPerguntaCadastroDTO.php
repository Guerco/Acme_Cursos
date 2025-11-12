<?php

class RespostaPerguntaCadastroDTO {
    public function __construct(
        public bool $ehCorreta,
        public string $descricao
    ){}

    /**
     * @param array{
     *     ehCorreta: bool,
     *     descricao: string
     * } $dados
     */
    public static function deArray(array $dados): RespostaPerguntaCadastroDTO{
        return new self(
            (bool) $dados['ehCorreta'],
            trim($dados['descricao'])
        );
    }

    /**
     * @param array{
     *     ehCorreta: bool,
     *     descricao: string
     * }[] $dados
     */
    public static function deArrays(array $dados): array{
        $respostas = [];

        foreach($dados as $dado){
            $respostas[] = self::deArray($dado);
        }

        return $respostas;
    }

    public function paraObjeto() : RespostaPergunta {
        return new RespostaPergunta(
            0,
            null,
            $this->descricao,
            (bool) $this->ehCorreta
        );
    }
}