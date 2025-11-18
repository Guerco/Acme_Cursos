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
     * 
     * @return RespostaPerguntaCadastroDTO[]
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

    public static function deObjeto(RespostaPergunta $resposta): RespostaPerguntaCadastroDTO {
        return new self(
            $resposta->isCorreta(),
            $resposta->getDescricao()
        );
    }

    /**
     * @param RespostaPergunta[] $respostas
     * @return RespostaPerguntaCadastroDTO[]
     */
    public static function deObjetos(array $respostas): array {
        $dtos = [];

        foreach($respostas as $r) {
            $dtos [] = self::deObjeto($r);
        }

        return $dtos;
    }
}