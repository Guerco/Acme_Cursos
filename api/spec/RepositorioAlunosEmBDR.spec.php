<?php
require_once 'configBDTeste.php';

describe('RepositorioAlunosEmBDR', function(){
    
    $resultado = [];

    beforeAll(function(){

        $this->pdo = prepararBDTestes();
        $this->repo = new RepositorioAlunosEmBDR($this->pdo);

    });

    describe('existeComId', function(){

        it('retorna se existe um aluno pelo id', function():void{
            $id = 1;
            $resultado = $this->repo->existeComId($id);
            expect($resultado)->toBeAn('bool');
            expect($resultado)->toBe(true);
        });
       
    });

    describe('existeComCredenciais', function(){

        it('retorna um objeto de aluno', function(){
            $credencial = new Credenciais(0,'aluno@email.com', 123);
            $resultado = $this->repo->existeComCredenciais($credencial);
            expect($resultado)->toBeAn('object');
            expect($resultado)->not->toBeEmpty(1);
            expect($resultado ?? null)->toBeAnInstanceOf(Aluno::class);
        });

    });

    describe('cadastrarResposta', function(){

        it('cadastra a resposta de um aluno', function(){
            $aluno = new Aluno(1,'Aluno', 0.0, null);
            $pergunta = new Pergunta(2,null,'Qual é o resultado de 5 + (-3)?', '', 60,DIFICULDADE::FACIL, []);
            $respostaAluno = new RespostaAluno($aluno, $pergunta);
            $resultado = $this->repo->cadastrarResposta($respostaAluno);

            $ps = $this->pdo->prepare(
                'SELECT id FROM resposta_aluno ra
                WHERE id_aluno = :idAluno and id_pergunta = :idPergunta' );
            $ps->execute([ 
                'idAluno' => $respostaAluno->getAluno()->getId(), 
                'idPergunta' => $respostaAluno->getPergunta()->getId() 
                ]);
            expect( $ps->rowCount() )->toBeGreaterThan( 0 );

        });
        
    });

    describe('existeResposta', function(){

        it('verifica se existe a resposta do aluno para determinada pergunta', function(){
            $idAluno = 1;
            $idPergunta = 1;
            $resultado = $this->repo->existeResposta($idAluno, $idPergunta);
            expect($resultado)->toBeAn('int');
            expect($resultado)->toBe(1);
        });

    });

    describe('buscarPontuacaoPorCurso', function(){

        it('quando existe pontuacao do aluno em determinado curso', function(){
            $idAluno = 1;
            $idCurso = 1;
            $resultado = $this->repo->buscarPontuacaoPorCurso($idAluno,$idCurso);
            expect($resultado)->toBeAn('float');
            expect($resultado)->toBe(10.0);
        });

        it('verifica quando não existe pontuacao do aluno em determinado curso', function(){
            $idAluno = 1;
            $idCurso = 2;
            $resultado = $this->repo->buscarPontuacaoPorCurso($idAluno,$idCurso);
            expect($resultado)->toBeAn('bool');
            expect($resultado)->toBe(false);
        });

    });

    describe('incrementarPontuacaoGeral', function(){

        it('incrementa a pontuação geral do aluno', function(){
            $idAluno = 1;
            $valor = 11;
            $resultado = $this->repo->incrementarPontuacaoGeral($idAluno, $valor);

            $ps = $this->pdo->prepare(
                'SELECT a.pontuacao_geral FROM aluno a
                WHERE id = :idAluno' );
            $ps->execute([ 
                'idAluno' => $idAluno]);
            (float) $valor = $ps->fetchColumn();
           
            expect($valor)->toBe(11.0);

        });

    });

    describe('incrementarPontuacaoCurso', function(){

         it('incrementa a pontuação geral do aluno', function(){
            $idAluno = 1;
            $idCurso = 1;
            $valor = 12;
            $resultado = $this->repo->incrementarPontuacaoCurso($idAluno,$idCurso, $valor);

            $ps = $this->pdo->prepare(
                'SELECT p.pontuacao FROM pontuacao p
                WHERE id = :idAluno and id_curso = :idCurso' );
            $ps->execute([ 
                'idAluno' => $idAluno,
                'idCurso' => $idCurso
            ]);

            (float) $valor = $ps->fetchColumn();
            expect($valor)->toBe(22.0);

        });

    });

    afterAll(function(){

        excluirBDTestes($this->pdo);
        
    });

});