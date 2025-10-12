<?php

interface RepositorioCursos{

    /**
     * Retorna todos os cursos e pelo nome do curso ou professor informado.
     * @param string $nome ou ''
     * @return array
     */
    public function listarCursos(string $nome):array;

}


?>