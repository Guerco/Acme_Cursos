<?php

class GestorAlunos {
    public function __construct(
        private RepositorioAlunos $repositorioAlunos,
        private RepositorioPerguntas $repositorioPerguntas,
        private GerenciadorDeTransacoes $transacao,
        private RepositorioAssuntos $repositorioAssuntos,
        private Autentificacao $autentificacao,
        private Autorizacao $autorizacao
    ) { }

    /**
     * @param TipoUsuario[] $autorizados
     * @throws NaoAutorizadoException
     */
    private function autorizar (array $autorizados): void {
        $usuariosAutorizados = array_map(
            fn(TipoUsuario $tipo) => $tipo->value,
            $autorizados
        );

        $estaAutorizado = (
            $this->autentificacao->estaLogado() &&
            $this->autorizacao->verificarAutorizacao($usuariosAutorizados)
        );

        if (! $estaAutorizado) throw new NaoAutorizadoException('Não possui acesso a este recurso.');
    }

    /**
     * @param array<string|mixed> $resposta
     * @throws DominioException
     * @return bool
     */
    public function salvarResposta(array $resposta): bool{ 
        $this->autorizar(
            [
                TipoUsuario::ALUNO
            ]
        );

        $this->verificarEntradaSalvarResposta($resposta);
        
        try {
            $idAluno = 0;
            $idPergunta = $resposta['idPergunta'];
            $idsRespostas = $resposta['idsRespostas'] ?? [];

            if ( 
                $this->autentificacao->estaLogado() 
                && $this->autentificacao->buscarTipoUsuario() === TipoUsuario::ALUNO->value
            ) {
                $idAluno = $this->autentificacao->buscaridUsuario();
            } 
            
            $this->validarSalvarResposta($idPergunta, $idAluno);

            $this->transacao->iniciar();

            $aluno = new Aluno($idAluno);

            $pergunta = new Pergunta($idPergunta, null);

            $acertou = empty($idsRespostas) ? false : $this->verificarRespostasCorretas($idPergunta, $idsRespostas); 

            $respostaObj = new RespostaAluno($aluno, $pergunta, 0, $acertou);

            if ($this->repositorioAlunos->existeResposta($aluno->getId(), $pergunta->getId()))
                    throw new DominioException('Resposta já cadastrada para o aluno.');
                
            $this->repositorioAlunos->cadastrarResposta($respostaObj);
            if ($acertou) $this->atualizarPontuacoes($aluno, $pergunta);
            
            $this->transacao->confirmar();
            return $respostaObj->isRespostaCorreta();
        } catch (Throwable $e) {
            $this->transacao->reverter();
            throw $e;
        }
    }

    /**
     * @param array<string, mixed> $dados
     *
     * @throws DominioException
     */
    private function verificarEntradaSalvarResposta(array $dados): void
    {
        $problemas = [];

        $formatoEsperado = [
            'idPergunta' => [
                'tipo' => TiposCampos::INT,
                'obrigatorio' => true,
            ],
            'idsRespostas' => [
                'tipo' => TiposCampos::ARRAY,
                'tipoaArray' => TiposCampos::INT
            ],
        ];
        
        $problemas = Validador::validarArraySchema($dados, $formatoEsperado);

        if (!empty($problemas))
            throw DominioException::comProblemas($problemas);
    }

    private function validarSalvarResposta(mixed $idPergunta, mixed $idAluno): void{
        $idPergunta = $idPergunta ?? null;
        $idAluno = $idAluno ?? null;

        if ($idPergunta === null) {
            throw new DominioException('Informe a pergunta.'); 
        }

        $problemas = [];
        if (!$this->repositorioPerguntas->existeComId($idPergunta)) 
            $problemas [] = 'Pergunta inexistente.';
        if (!$this->repositorioAlunos->existeComId((int) $idAluno)) 
            $problemas [] = 'Aluno inexistente.';
        if(! empty($problemas))
            throw DominioException::comProblemas($problemas);
    }

    private function atualizarPontuacoes(Aluno $aluno, Pergunta $pergunta): void{
        /** @var array{idCurso: string, dificuldade: string} $infoPergunta  */
        $infoPergunta = $this->repositorioPerguntas->buscarCursoEDificuldadePeloID($pergunta->getId());
        /** @var Dificuldade $dificuldade  */
        $dificuldade = Dificuldade::deString($infoPergunta['dificuldade']);
        $valorPergunta = $dificuldade->getValor();

        $idAluno = $aluno->getId();
        $idCurso = (int) $infoPergunta['idCurso'];

        if ($valorPergunta <= 0) {
            throw new DominioException('Valor inválido para pontuação.');
        }

        $this->repositorioAlunos->incrementarPontuacaoGeral($idAluno, $valorPergunta);
        $this->repositorioAlunos->incrementarPontuacaoCurso($idAluno, $idCurso, $valorPergunta);
    }

    /**
     * @param array<string|int> $idsRespostas
     */
    private function verificarRespostasCorretas(int $idPergunta, array $idsRespostas):bool{
        $idsRespostasCorretas = $this->repositorioPerguntas->buscarIdsRespostasCorretas($idPergunta);

        sort(($idsRespostas));
        sort($idsRespostasCorretas);

        return array_unique($idsRespostas) == $idsRespostasCorretas;
    }

    public function buscarPontuacoes(mixed $idAssunto): PontuacoesAlunoDTO {
        $this->autorizar(
            [
                TipoUsuario::ALUNO
            ]
        );

        $idAluno = 0;

        if ( 
            $this->autentificacao->estaLogado() 
            && $this->autentificacao->buscarTipoUsuario() === TipoUsuario::ALUNO->value
        ) {
            $idAluno = $this->autentificacao->buscaridUsuario();
        } 

        $this->validarBuscarPontuacoes($idAssunto, $idAluno);

        /**
         * @var Assunto $assunto
         */
        $assunto = $this->repositorioAssuntos->buscarPeloId($idAssunto);

        /**
         * @var Curso
         */
        $curso = $assunto->getCurso();
        $pontuacaoCurso = ($this->repositorioAlunos->buscarPontuacaoPorCurso(
            $idAluno, 
            $curso->getId()
        ))->getPontuacao();

        $pontuacaoGeral = (float) $this->repositorioAlunos->buscarPontuacaoGeral(
            $idAluno, 
        );

        return new PontuacoesAlunoDTO(
            $assunto->getDescricao(),
            $pontuacaoGeral,
            (float) $pontuacaoCurso
        );
    }

    private function validarBuscarPontuacoes(mixed  $idAssunto, mixed  $idAluno): void {
        $idAssunto = $idAssunto ?? null;
        $idAluno = $idAluno ?? null;

        if ($idAssunto === null) {
            throw new DominioException('Informe o assunto.'); 
        } else if (
            !filter_var($idAssunto, FILTER_VALIDATE_INT)
            || !filter_var($idAluno, FILTER_VALIDATE_INT)
        ) {
            throw new DominioException('Os ids devem ser inteiros.');     
        }

        $problemas = [];
        if (! $this->repositorioAssuntos->existeComId((int) $idAssunto))
            throw new DominioException('Assunto inexistente.');
        if (! $this->repositorioAlunos->existeComId((int) $idAluno))
            throw new DominioException('Aluno inexistente.');
    }
    
    /**
     * @param string $nome || ''
     * @return AlunoRelDTO[]
     */
    public function listarRankingPorPontuacaoGeral(string $nome): array{
        $this->autorizar(
            [
                TipoUsuario::ALUNO,
                TipoUsuario::ADMINISTRADOR,
                TipoUsuario::PROFESSOR,
                TipoUsuario::PROFESSOR_ADMINISTRADOR
            ]
        );
        
        $dados = [];
        $resultado = [];

        $dados = $this->repositorioAlunos->rankingPorPontuacaoGeral($nome);
        $resultado = AlunoRelDTO::deVOS($dados);

        return $resultado;
    }

    /**
     * @param string $nome || ''
     * @return AlunoCursoRelDTO[]
     */
    public function listarRankingAlunosPorCurso(string $nome): array{
        $this->autorizar(
            [
                TipoUsuario::ALUNO,
                TipoUsuario::ADMINISTRADOR,
                TipoUsuario::PROFESSOR,
                TipoUsuario::PROFESSOR_ADMINISTRADOR
            ]
        );
        
        $dados = [];
        $resultado = [];

        $dados = $this->repositorioAlunos->rankingAlunosPorCurso($nome);
       
        $resultado = AlunoCursoRelDTO::deVOS($dados);

        return $resultado;
    }

    public function buscarQuizAleatorio() : int {
        $this->autorizar(
            [
                TipoUsuario::ALUNO
            ]
        );

        $idAluno = 0;

        if ( 
            $this->autentificacao->estaLogado() 
            && $this->autentificacao->buscarTipoUsuario() === TipoUsuario::ALUNO->value
        ) {
            $idAluno = $this->autentificacao->buscaridUsuario();
        } 

        $this->validarQuizAleatorio( $idAluno);

        $ids = $this->repositorioAlunos->buscarIdsAssuntosNaoRespondidos($idAluno);

        return (int) $ids[array_rand($ids)];
    }

    private function validarQuizAleatorio(mixed  $idAluno): void {
        $idAluno = $idAluno ?? null;

        if (
            !filter_var($idAluno, FILTER_VALIDATE_INT)
        ) {
            throw new DominioException('Os ids devem ser inteiros.');     
        }

        if (! $this->repositorioAlunos->existeComId((int) $idAluno))
            throw new DominioException('Aluno inexistente.');
    }

    
}