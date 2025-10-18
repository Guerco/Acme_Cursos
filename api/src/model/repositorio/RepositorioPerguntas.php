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
     * Busca uma curso e dificuldade de uma pergunta com determinado id.
     * 
     * @param int $id
     * @return ?array
     */
    public function buscarCursoEDificuldadePeloID(int $id): ?array;

    /**
     * Busca as perguntas de determinado assunta que ainda não foram respondidas por um determinado aluno.
     * 
     * @param int $idAssunto
     * @param int $idAluno
     * @return array
     */
    public function buscarPorAssuntoEAluno(int $idAssunto, int $idAluno) : array;

    /**
     * Busca as respostas corretas de uma determinada pergunta
     * 
     * @param int $idPergunta
     */
    public function buscarIdsRespostasCorretas(int $idPergunta): array;
}