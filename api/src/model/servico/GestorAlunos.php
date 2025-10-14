<?php

class GestorAlunos {
    public function __construct(
        private RepositorioAlunos $repositorioAlunos,
        private RepositorioPerguntas $repositorioPerguntas
    ){}

    public function verificarCredenciais(array $dados) : AlunoListagemDTO {
        if (! $dados['email'] || ! $dados['senha']) {
            throw new DominioException('Informe email e senha.'); 
        }

        $credenciais = new Credenciais(null, $dados['email'], $dados['senha']);

        $problemas = $credenciais->validar();
        if (!empty($problemas)){
            throw DominioException::comProblemas($problemas);
        }

        $aluno = $this->repositorioAlunos->existeComCredenciais($credenciais);

        if(!$aluno){
            throw new NaoEncontradoException('Credenciais inválidas.'); 
        } else return AlunoListagemDTO::deObjeto($aluno);
    }

    public function salvarResposta(array $dados){
        $this->validarSalvarResposta($dados);

        $respostaAluno = new RespostaAluno(
            new Aluno($dados['idAluno']),
            new Pergunta($dados['idPergunta'], null),
            (bool) $dados['respostaCorreta']
        );

        $this->repositorioAlunos->cadastrarResposta($respostaAluno);
    }
    private function validarSalvarResposta(array $dados){
        $idAluno = $dados['idAluno'] ?? null;
        $idPergunta = $dados['idPergunta'] ?? null;
        $respostaCorreta = isset($dados['respostaCorreta']) ? $dados['respostaCorreta'] : null;
        
        $problemas = [];
        if ($idAluno === null || $idPergunta === null) {
            $problemas [] ='Informe aluno e pergunta.'; 
        } else if (
            !filter_var($idAluno, FILTER_VALIDATE_INT) ||
            !filter_var($idPergunta, FILTER_VALIDATE_INT)
        ) {
            $problemas [] ='Os ids devem ser inteiros.';     
        } 

        if ($respostaCorreta === null) {
            $problemas [] ='Informe se a resposta foi correta.';     
        } else if (!is_bool($respostaCorreta)) {
            $problemas [] ='Resposta Correta deve ser boolean.';     
        }

        if(empty($problemas)) {
            if (!$this->repositorioAlunos->existeComId($idAluno)) {
                $problemas [] ='Aluno inexistente.';
            } 
            if (!$this->repositorioPerguntas->existeComId($idPergunta)) {
                $problemas [] ='Pergunta inexistente.';
            } 
            if(! empty($problemas)) throw NaoEncontradoException::comProblemas($problemas);
            else {
                if ($this->repositorioAlunos->existeResposta($idAluno, $idPergunta))
                throw new DominioException('Resposta já cadastrada para o aluno.');
            }
        } else {
            throw DominioException::comProblemas($problemas);
        }
    }
}