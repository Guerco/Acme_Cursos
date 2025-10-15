<?php

class GestorPerguntas {
    public function __construct(
        private RepositorioPerguntas $repositorioPerguntas,
        private RepositorioAlunos $repositorioAlunos
    ){}

    public function buscarPerguntasAluno (string|int $idAssunto, string|int $idAluno) {
        $this->validarBuscarPerguntasAluno($idAssunto, $idAluno);
        $perguntas = $this->repositorioPerguntas->buscarPorAssuntoEAluno($idAssunto, $idAluno);
        shuffle($perguntas);
        return PerguntaListagemDTO::deObjetos($perguntas);
    }

    private function validarBuscarPerguntasAluno(string|int $idAssunto, string|int $idAluno){
        $idAssunto = $idAssunto ?? null;
        $idAluno = $idAluno ?? null;

        if ($idAssunto === null || $idAluno === null ) {
            throw new DominioException('Informe assunto e aluno.'); 
        } else if (
            !filter_var($idAssunto, FILTER_VALIDATE_INT) ||
            !filter_var($idAluno, FILTER_VALIDATE_INT)
        ) {
            throw new DominioException('Os ids devem ser inteiros.');     
        }
        
        if (! $this->repositorioAlunos->existeComId($idAluno)){
            throw new NaoEncontradoException('Aluno inexistente.');
        }
    }
}