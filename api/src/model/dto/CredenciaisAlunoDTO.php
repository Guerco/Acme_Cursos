<?php

class CredenciaisAlunoDTO{

    public function __construct(
        public string $email,
        public string $senha,
        public int $idPergunta,
        public ?array $idsRespostas
    ){}

    public static function deArrayParaDTO(array $dados): CredenciaisAlunoDTO{
        return new Self(
            $dados['credenciaisAluno']['email'],
            $dados['credenciaisAluno']['senha'],
            $dados['idPergunta'],
            $dados['idsRespostas'] ?? null
        );
    }

    public static function deArraysParaDTO(array $dados): array{
        $credenciaisAlunoDTO = [];

        foreach($dados as $dado){
            $credenciaisAlunoDTO[] = Self::deArrayParaDTO($dado);
        }

        return $credenciaisAlunoDTO;
    }

}