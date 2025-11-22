<?php

interface RepositorioAssuntos
{
    /**
     * Verifica se existe um assunto com determinado id.
     * 
     * @param int $id
     * @return bool
     */
    public function existeComId(int $id): bool;

    /**
     * Retorna todos os assuntos de um curso.
     * @param int $idCurso
     * @return Assunto[]
     */
    public function buscarPorIdCurso(int $idCurso): array;

    /**
     * Retorna o assunto de determinado id.
     * @param int $idAssunto
     * @return Assunto
     */
    public function buscarPeloId(int $id): bool|Assunto;
}


?>