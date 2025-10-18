<?php

class RespostaAlunoCadastroDTO{

    public function __construct(
        public array $credenciais,
        public int $idPergunta,
        public ?array $idsRespostas
    ){}

    public static function deArray(array $dados): RespostaAlunoCadastroDTO{
        return new self(
            
            (array) $dados['credenciaisAluno'],
            (int) $dados['idPergunta'],
            $dados['idsRespostas'] ?? []
        );
    }

    public static function deArrays(array $dados): array{
        $credenciaisAlunoDTO = [];

        foreach($dados as $dado){
            $credenciaisAlunoDTO[] = self::deArray($dado);
        }

        return $credenciaisAlunoDTO;
    }

}