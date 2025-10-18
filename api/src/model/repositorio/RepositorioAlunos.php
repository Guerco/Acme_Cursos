<?php

interface RepositorioAlunos {
    /**
     * Verifica se existe um aluno com determinado id.
     * 
     * @param int $id
     * @return bool
     */
    public function existeComId(int $id): bool;
    
    /**
     * Verifica se existe um usuário com determinadas credenciais e retorna suas informações caso encotnre.
     * 
     * @param Credenciais $credenciais
     * @return Aluno
     */
    function existeComCredenciais(Credenciais $credenciais): Aluno|bool;

    /**
     * Cadastra uma resposta de uma pergunta para determinado aluno.
     * @param RespostaAluno $respostaAluno
     * @return bool
     */
    public function cadastrarResposta(RespostaAluno $respostaAluno): void;

    /**
     * Verifica se um aluno já possui resposta cadastrada para uma determinada pergunta.
     * 
     * @param RespostaAluno $respostaAluno
     * @return int
     */
    public function existeResposta(int $idAluno, int $idPergunta): int;

    /**
     * Busca a pontuação de um aluno em um determinado curso.
     * @param mixed $idAluno
     * @param mixed $idCurso
     * @return float|bool
     */
    public function buscarPontuacaoPorCurso($idAluno, $idCurso): float|bool;

    /**
     * Incrementa a pontuação geral de um aluno em um valor.
     * 
     * @param int $idAluno
     * @param float $valor
     * @return void
     */
    public function incrementarPontuacaoGeral(int $idAluno, float $valor) : void;

    /**
     * Incrementa a pontuação de um aluno para um curso em um valor.
     * 
     * @param int $idAluno
     * @param int $idCurso
     * @param float $valor
     * @return void
     */
    public function incrementarPontuacaoCurso(int $idAluno, int $idCurso, float $valor) : void;
}