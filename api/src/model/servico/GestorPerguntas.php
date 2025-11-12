<?php

class GestorPerguntas
{
    private const DIRETORIO_IMG_PERGUNTAS = __DIR__ . '/../../../img/perguntas';

    public function __construct(
        private RepositorioPerguntas $repositorioPerguntas,
        private RepositorioAlunos $repositorioAlunos,
        private RepositorioAssuntos $repositorioAssuntos,
        private RepositorioRespostasPergunta $repositorioRespostas
    ) {
    }

    /**
     * @return PerguntaListagemDTO[]
     */
    public function buscarPerguntasAluno(string|int $idAssunto, string|int $idAluno): array
    {
        $this->validarBuscarPerguntasAluno($idAssunto, $idAluno);
        $perguntas = $this->repositorioPerguntas->buscarPorAssuntoEAluno((int) $idAssunto, (int) $idAluno);
        shuffle($perguntas);
        return PerguntaListagemDTO::deObjetos($perguntas);
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

        if (!$this->repositorioAlunos->existeComId((int) $idAluno)) {
            throw new NaoEncontradoException('Aluno inexistente.');
        }
    }

    public function criarPergunta(PerguntaCadastroDTO $pergunta): void
    {
        $nomeImg = null;
        try {
            GerenciadorDeTransacao::iniciar();

            $pergunta->validar();
            $this->validarCriarPergunta($pergunta);

            if (!is_null($pergunta->figuraBase64))
                $nomeImg = $this->salvarFiguraBase64($pergunta->figuraBase64);

            $perguntaObj = $pergunta->paraObjeto();

            if (!is_null($nomeImg)) $perguntaObj->setCaminhoImg($nomeImg);

            $perguntaObj->setId($this->repositorioPerguntas->cadastrarPergunta($perguntaObj));

            foreach ($perguntaObj->getRespostas() as $r) {
                $r->setPergunta($perguntaObj);
                $this->repositorioRespostas->cadastrarResposta($r);
            }

            GerenciadorDeTransacao::confirmar();
        } catch (Throwable $e) {
            GerenciadorDeTransacao::reverter();
            if (!is_null($nomeImg)) $this->excluirFigura($nomeImg);
            throw $e;
        }
    }

    private function validarCriarPergunta(PerguntaCadastroDTO $pergunta): void
    {
        $idAssunto = $pergunta->idAssunto;

        if (!$this->repositorioAssuntos->existeComId((int) $idAssunto)) {
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
}