<?php

class AlunoListagemDTO{

    public function __construct(
        public int $id,
        public string $nome,
        public float $pontuacaoGeral,
    ){}
    
    public static function deObjeto(Aluno $aluno): AlunoListagemDTO {
        return new Self(
            $aluno->getId(),
            $aluno->getNome(),
            $aluno->getPontuacaoGeral()
        );
    }

    public static function deObjetos(array $alunos): array {
        $dtos = [];

        foreach($alunos as $r) {
            $dtos [] = Self::deObjeto($r);
        }

        return $dtos;
    }
}