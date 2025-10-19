<?php

class RespostaAlunoCadastroDTO{

    /**
     * @param string[] $credenciais
     * @param string[]|int[] $idsRespostas
     */
    public function __construct(
        public array $credenciais,
        public int $idPergunta,
        public ?array $idsRespostas
    ){}


    /**
     * @param array{'credenciaisAluno': string[], "idPergunta": int, "idsRespostas":null|array<string|int>} $dados
     */
    public static function deArray(array $dados): RespostaAlunoCadastroDTO{
        return new self(
            
            (array) $dados['credenciaisAluno'],
            (int) $dados['idPergunta'],
            $dados['idsRespostas'] ?? []
        );
    }

    /**
     * @param array{'credenciaisAluno': string[], "idPergunta": int, "idsRespostas":null|array<string|int>}[] $dados
     * @return RespostaAlunoCadastroDTO[]
     */
    public static function deArrays(array $dados): array{
        $respostas = [];

        foreach($dados as $dado){
            $respostas[] = self::deArray($dado);
        }

        return $respostas;
    }

}