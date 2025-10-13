<?php 

interface RepositorioPerguntas {
    /**
     * Busca as perguntas de determinado assunta que ainda não foram respondidas por um determinado aluno.
     * 
     * @param int $idAssunto
     * @param int $idAluno
     * @return array
     */
    public function buscarPorAssuntoEAluno(int $idAssunto, int $idAluno) : array;
}