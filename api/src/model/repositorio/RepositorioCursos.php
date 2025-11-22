<?php

interface RepositorioCursos{
    /**
     * Verifica se existe um curso com determinado id.
     * 
     * @param int $id
     * @return bool
     */
    public function existeComId(int $id): bool;

    /**
     * Retorna todos os cursos e pelo nome do curso ou professor informado.
     * @param string $nome ou ''
     * @return Curso[]
     */
    public function listarCursos(string $nome):array;

    /**
     * Retorna todos os cursos de um professor.
     * @param int $idProfessor
     * @return Curso[]
     */
    public function buscarPorIdProfessor(int $idProfessor):array;

    /**
     * Retorna a quantidade de alunos por curso
     * @return CursoQtdAlunoRelVO[]
     */
    public function numeroDeAlunosPorCurso():array;
}


?>