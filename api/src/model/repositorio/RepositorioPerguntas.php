<?php 

interface RepositorioPerguntas {
    /**
     * Verifica se existe uma pergunta com determinado id.
     * 
     * @param int $id
     * @return bool
     */
    public function existeComId(int $id): bool;
    
    /**
     * Busca as perguntas de determinado assunta que ainda não foram respondidas por um determinado aluno.
     * 
     * @param int $idAssunto
     * @param int $idAluno
     * @return array
     */
    public function buscarPorAssuntoEAluno(int $idAssunto, int $idAluno) : array;
}