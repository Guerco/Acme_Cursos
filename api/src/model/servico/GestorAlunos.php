<?php

class GestorAlunos {
    public function __construct(
        private RepositorioAlunos $repositorioAlunos,
        private RepositorioPerguntas $repositorioPerguntas,
        private RepositorioCursos $repositorioCursos
    ){}

    /**
     * @param array{'email':string, 'senha':string} $dados
     */
    public function verificarCredenciais(array $dados) : AlunoListagemDTO {
        $credenciais = $this->validarCredenciais($dados);

        $aluno = $this->repositorioAlunos->existeComCredenciais($credenciais);

        if(!$aluno){
            throw new NaoEncontradoException('Credenciais inválidas.'); 
        } else return AlunoListagemDTO::deObjeto($aluno);
    }

    public function salvarResposta(RespostaAlunoCadastroDTO $resposta): bool{ 
        $this->validarSalvarResposta($resposta);
        
        $credenciais = $this->validarCredenciais($resposta->credenciais);
        $aluno = $this->repositorioAlunos->existeComCredenciais($credenciais);

        if(!$aluno) throw new NaoEncontradoException('Credenciais inválidas.'); 

        $pergunta = new Pergunta($resposta->idPergunta, null);

        $acertou = empty($resposta->idsRespostas) ? false : $this->verificarRespostasCorretas($resposta->idPergunta, $resposta->idsRespostas); 

        $respostaObj = new RespostaAluno($aluno, $pergunta, 0, $acertou);

        if ($this->repositorioAlunos->existeResposta($aluno->getId(), $pergunta->getId()))
                throw new DominioException('Resposta já cadastrada para o aluno.');
            
        $this->repositorioAlunos->cadastrarResposta($respostaObj);
        if ($acertou) $this->atualizarPontuacoes($aluno, $pergunta);
        
        return $respostaObj->isRespostaCorreta();
    }

    private function validarSalvarResposta(RespostaAlunoCadastroDTO $resposta): void{
        $idPergunta = $resposta->idPergunta ?? null;

        $problemas = [];
        if ($idPergunta === null) {
            $problemas [] ='Informe a pergunta.'; 
        }

        if(empty($problemas)) {
            if (!$this->repositorioPerguntas->existeComId($idPergunta)) 
                throw new NaoEncontradoException ('Pergunta inexistente.');
        } else {
            throw DominioException::comProblemas($problemas);
        }
    }

    private function atualizarPontuacoes(Aluno $aluno, Pergunta $pergunta): void{
        $infoPergunta = $this->repositorioPerguntas->buscarCursoEDificuldadePeloID($pergunta->getId());
        $valorPergunta = Dificuldade::deString($infoPergunta['dificuldade'])->getValor();

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

    /**
     * @param array{'email':string|null, 'senha':string|null} $dados
     */
    private function validarCredenciais(array $dados): Credenciais {
        $email = $dados['email'] ?? null;
        $senha = $dados['senha'] ?? null;

        if ($email === null || $senha === null) {
            throw new DominioException('Informe email e senha.'); 
        }

        $credenciais = new Credenciais(null, $email, $senha);

        $problemas = $credenciais->validar();
        if (!empty($problemas)){
            throw DominioException::comProblemas($problemas);
        }
        
        return $credenciais;
    }

    public function buscarPontuacaoCurso(int|string $idAluno, int|string $idCurso): float {
        $this->validarBuscarPontuacaoCurso($idAluno, $idCurso);
        return (float) $this->repositorioAlunos->buscarPontuacaoPorCurso($idAluno, $idCurso);
    }

    private function validarBuscarPontuacaoCurso(int|string|null  $idAluno, int|string|null $idCurso): void {
        $idAluno = $idAluno ?? null;
        $idCurso = $idCurso ?? null;

        if ($idAluno === null || $idCurso === null ) {
            throw new DominioException('Informe aluno e curso.'); 
        } else if (
            !filter_var($idAluno, FILTER_VALIDATE_INT) ||
            !filter_var($idCurso, FILTER_VALIDATE_INT)
        ) {
            throw new DominioException('Os ids devem ser inteiros.');     
        }
        
        $problemas = [];
        if (! $this->repositorioAlunos->existeComId($idAluno)){
            $problemas [] = 'Aluno inexistente.';
        }  
        if (! $this->repositorioCursos->existeComId($idCurso)){
            $problemas [] = 'Curso inexistente.';
        }    
        if(! empty($problemas)) throw NaoEncontradoException::comProblemas($problemas);
    }  
}