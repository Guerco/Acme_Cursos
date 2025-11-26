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
     * @return null|array{idCurso: string, dificuldade: string}
     */
    public function buscarCursoEDificuldadePeloID(int $id): ?array;

    /**
     * Busca as perguntas de determinado assunta que ainda não foram respondidas por um determinado aluno.
     * 
     * @param int $idAssunto
     * @param int $idAluno
     * @return Pergunta[]
     */
    public function buscarPorAssuntoEAluno(int $idAssunto, int $idAluno) : array;

    /**
     * Busca as respostas corretas de uma determinada pergunta
     * 
     * @param int|string $idPergunta
     * @return array<int|string>
     */
    public function buscarIdsRespostasCorretas(int|string $idPergunta): array;

    /**
     * Cadastra uma pergunta e retorna o id cadastrado.
     * @param Pergunta $pergunta
     * @return int
     */
    public function cadastrarPergunta(Pergunta $pergunta): int;

    /**
     * Lista todas perguntas ou filtrado pelo assunto.
     * 
     * @param ?int $idAssunto
     * @return null|Pergunta[]
     */
    public function listarTodosOuPorAssunto(?int $idAssunto): ?array;

    /**
    * Verifica se já existe uma pergunta em determinado assunto.
     * @param int|null $idAssunto
     * @param string|null $perguntaDescricao
     * @return bool
     */
    public function existePerguntaAssunto(?int $idAssunto, ?string $perguntaDescricao): bool;
}