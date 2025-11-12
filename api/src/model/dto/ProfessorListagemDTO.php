<?php

class ProfessorListagemDTO{

    public function __construct(
        public int $id,
        public string $nome,
    ){}
    
    public static function deObjeto(Professor $professor): ProfessorListagemDTO {
        return new Self(
            $professor->getId(),
            $professor->getNome()
        );
    }

    /**
     * @param Professor[] $alunos
     * @return ProfessorListagemDTO[]
     */
    public static function deObjetos(array $professores): array {
        $dtos = [];

        foreach($professores as $p) {
            $dtos [] = Self::deObjeto($p);
        }

        return $dtos;
    }
}