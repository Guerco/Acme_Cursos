<?php

class GestorPerguntas
{
    private const DIRETORIO_IMG_PERGUNTAS = __DIR__ . '/../../../img/perguntas';

    public function __construct(
        private RepositorioPerguntas $repositorioPerguntas,
        private RepositorioAlunos $repositorioAlunos,
        private RepositorioAssuntos $repositorioAssuntos,
        private RepositorioRespostasPergunta $repositorioRespostas,
        private GerenciadorDeTransacoes $transacao,
        private Autentificacao $autentificacao,
        private Autorizacao $autorizacao
    ) {
    }

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
     * @return PerguntaListagemQuizDTO[]
     */
    public function buscarPerguntasAluno(string|int $idAssunto): array {
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

        $this->validarBuscarPerguntasAluno($idAssunto, $idAluno);
        $perguntas = $this->repositorioPerguntas->buscarPorAssuntoEAluno((int) $idAssunto, (int) $idAluno);
        shuffle($perguntas);
        return PerguntaListagemQuizDTO::deObjetos($perguntas);
    }

    private function validarBuscarPerguntasAluno(string|int|null $idAssunto, string|int|null $idAluno): void
    {
        $idAssunto = $idAssunto ?: null;
        $idAluno = $idAluno ?: null;

        if ($idAssunto === null || $idAluno === null) {
            throw new DominioException('Informe assunto e aluno.');
        } else if (
            !filter_var($idAssunto, FILTER_VALIDATE_INT) ||
            !filter_var($idAluno, FILTER_VALIDATE_INT)
        ) {
            throw new DominioException('Os ids devem ser inteiros.');
        }

        if (!$this->repositorioAssuntos->existeComId((int) $idAssunto)) {
            throw new NaoEncontradoException('Assunto inexistente.');
        }
        if (!$this->repositorioAlunos->existeComId((int) $idAluno)) {
            throw new DominioException('Aluno inexistente.');
        }
    }

    /**
     * Summary of criarPergunta
     * @param array<string, mixed> $dados
     * @throws \DominioException
     * @return void
     */
    public function criarPergunta(array $dados): void {
        $nomeImg = null;

        if (! Validador::validarFormato($dados, TiposCampos::ARRAY)) {
            throw new DominioException('Os dados devem ser enviados em forma de objeto JSON.');
        }
        $this->verificarEntradaCriarPergunta($dados);

        $this->autorizar(
            [
                TipoUsuario::PROFESSOR,
                TipoUsuario::ADMINISTRADOR,
                TipoUsuario::PROFESSOR_ADMINISTRADOR,
            ]
        );
    
        try {
            $this->transacao->iniciar();

            $perguntaDto = PerguntaCadastroDTO::deArray($dados);
            $this->validarCriarPergunta($perguntaDto);
            $pergunta = $perguntaDto->paraObjeto();

            $pergunta->validar();

            if (!is_null($perguntaDto->figuraBase64))
                $nomeImg = $this->salvarFiguraBase64($perguntaDto->figuraBase64);

            if (!is_null($nomeImg))
                $pergunta->setCaminhoImg($nomeImg);

            $pergunta->setId($this->repositorioPerguntas->cadastrarPergunta($pergunta));

            foreach ($pergunta->getRespostas() as $r) {
                $r->setPergunta($pergunta);
                $this->repositorioRespostas->cadastrarResposta($r);
            }

            $this->transacao->confirmar();
        } catch (Throwable $e) {
            $this->transacao->reverter();
            if (!is_null($nomeImg))
                $this->excluirFigura($nomeImg);
            throw $e;
        }
    }

    /**
     * @param array<string, mixed> $dados
     *
     * @throws DominioException
     */
    private function verificarEntradaCriarPergunta(array $dados): void
    {
        $problemas = [];

        $formatoEsperado = [
            'idAssunto' => [
                'tipo' => TiposCampos::INT,
                'obrigatorio' => true,
            ],
            'descricao' => [
                'tipo' => TiposCampos::STRING,
                'obrigatorio' => true,
            ],
            'dificuldade' => [
                'tipo' => TiposCampos::ENUM,
                'obrigatorio' => true,
                'valoresEnum' => ['facil', 'medio', 'dificil'],
            ],
            'tempoSeg' => [
                'tipo' => TiposCampos::INT,
                'obrigatorio' => true,
            ],
            'figuraBase64' => [
                'tipo' => TiposCampos::STRING,
            ],
            'respostas' => [
                'tipo' => TiposCampos::ARRAY,
                'obrigatorio' => true,
                'subcampos' => [
                    'ehCorreta' => [
                        'tipo' => TiposCampos::BOOL,
                        'obrigatorio' => true,
                    ],
                    'descricao' => [
                        'tipo' => TiposCampos::STRING,
                        'obrigatorio' => true,
                    ],
                ],
            ],
        ];
        
        $problemas = Validador::validarArraySchema($dados, $formatoEsperado);

        if (!empty($problemas))
            throw DominioException::comProblemas($problemas);
    }
    
    private function validarCriarPergunta(PerguntaCadastroDTO $pergunta): void
    {
        $idAssunto = $pergunta->idAssunto;
        $figuraBase64 = $pergunta->figuraBase64 ?: null;
        $dificuldade = $pergunta->dificuldade;

        $problemas = [];

        if ( 
            $this->autentificacao->estaLogado() 
            && $this->autentificacao->buscarTipoUsuario() === TipoUsuario::PROFESSOR->value
        ) {
            $idProfessorAssunto = $this->repositorioAssuntos->buscarIdProfessor($idAssunto);

            if ($idProfessorAssunto !== $this->autentificacao->buscaridUsuario())
                throw new DominioException('O assunto informado não é do professor logado.');
        } 

        $dificuldadesAceitas = ['facil', 'medio', 'dificil'];
        if (!in_array(strtolower($dificuldade), $dificuldadesAceitas))
            $problemas[] = "A dificuldade deve ser 'facil', 'medio' ou 'dificil'.";

        if (!is_null($figuraBase64)) {
            $imgData = base64_decode($figuraBase64);
            $tamanhoImgKB = strlen($imgData) / 1024;

            $infoImg = @getimagesizefromstring($imgData);
            if ($infoImg === false) {
                throw new DominioException('Figura inválida.');
            }

            [$width, $height, $tipo] = $infoImg;
            if ($tipo != IMAGETYPE_PNG && $tipo != IMAGETYPE_JPEG) {
                $problemas[] = 'A imagem deve estar nos formatos PNG ou JPEG.';
            }
            if ($tamanhoImgKB > 500) {
                $problemas[] = 'A imagem deve possuir no máximo 500KB.';
            }
        }

        if (!empty($problemas)) throw DominioException::comProblemas($problemas);
        else if (!$this->repositorioAssuntos->existeComId((int) $idAssunto)) {
            throw new DominioException('Assunto inexistente.');
        }
    }

    private function salvarFiguraBase64(string $figuraBase64): string
    {
        $imageData = base64_decode($figuraBase64);

        if (!file_exists(self::DIRETORIO_IMG_PERGUNTAS)) {
            $criou = mkdir(self::DIRETORIO_IMG_PERGUNTAS, 605, true);
            if (!$criou)
                throw new RuntimeException('Não foi possível gerar o diretório de imagens.');
        }

        $nomeArquivo = uniqid('imgpergunta_', true) . '.' . 'jpg';

        $criou = file_put_contents(self::DIRETORIO_IMG_PERGUNTAS . '/' . $nomeArquivo, $imageData);
        if (!$criou)
            throw new RuntimeException('Não foi possível salvar a figura.');
        return $nomeArquivo;
    }

    private function excluirFigura(string $nomeArquivo): void
    {
        $caminhoArquivo = self::DIRETORIO_IMG_PERGUNTAS . '/' . $nomeArquivo;
        if (file_exists($caminhoArquivo)) {
            unlink($caminhoArquivo);
        }
    }

    /**
     * @return PerguntaListagemDTO[]
     */
    public function listarPerguntasOuPorAssunto(?int $idAssunto): array {
        $this->autorizar(
            [
                TipoUsuario::PROFESSOR,
                TipoUsuario::ADMINISTRADOR,
                TipoUsuario::PROFESSOR_ADMINISTRADOR,
            ]
        );

        $this->validarListarPerguntasOuPorAssunto($idAssunto);

        $perguntas = $this->repositorioPerguntas->listarTodosOuPorAssunto($idAssunto);

        return PerguntaListagemDTO::deObjetos($perguntas);
    }

    private function validarListarPerguntasOuPorAssunto(?int $idAssunto): void
    {
        if (!is_null($idAssunto))
            if (!$this->repositorioAssuntos->existeComId((int) $idAssunto)) {
                throw new DominioException('Assunto inexistente.');
            }
    }
}