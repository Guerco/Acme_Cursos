<?php
require_once 'configBDTeste.php';

describe('RepositorioAlunosEmBDR', function(){
    
    $resultado = [];

    beforeAll(function(){

        $this->pdo = prepararBDTestes();
        $this->repoAlunos = new RepositorioAlunosEmBDR($this->pdo);
        $this->repoCredenciais = new RepositorioCredenciaisEmBDR($this->pdo);

    });

    describe('existeComId', function(){

        it('retorna se existe um aluno pelo id', function():void{
            $id = 1;
            $resultado = $this->repoAlunos->existeComId($id);
            expect($resultado)->toBeAn('bool');
            expect($resultado)->toBe(true);
        });
       
    });

    describe('existeComCredenciais', function(){

        it('retorna um objeto de aluno', function(){
            $credencial = new Credenciais(0,'aluno@email.com', 123);
            $resultado = $this->repoAlunos->existeComCredenciais($credencial);
            expect($resultado)->toBeAn('object');
            expect($resultado)->not->toBeEmpty();
            expect($resultado ?? null)->toBeAnInstanceOf(Aluno::class);
        });

    });

    describe('cadastrarResposta', function(){

        it('cadastra a resposta de um aluno', function(){
            $aluno = new Aluno(1,'Aluno', 0.0, null);
            $pergunta = new Pergunta(2,null,'Qual é o resultado de 5 + (-3)?', '', 60,DIFICULDADE::FACIL, []);
            $respostaAluno = new RespostaAluno($aluno, $pergunta);
            $resultado = $this->repoAlunos->cadastrarResposta($respostaAluno);

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
            $resultado = $this->repoAlunos->existeResposta($idAluno, $idPergunta);
            expect($resultado)->toBeAn('int');
            expect($resultado)->toBe(1);
        });

    });

    describe('buscarPontuacaoPorCurso', function(){

        it('quando existe pontuacao do aluno em determinado curso', function(){
            $idAluno = 1;
            $idCurso = 1;
            $resultado = $this->repoAlunos->buscarPontuacaoPorCurso($idAluno,$idCurso);
            expect($resultado)->toBeAn('object');
            expect($resultado)->toBeAnInstanceOf(PontuacaoCurso::class);
        });

    });
    
    describe('incrementarPontuacaoCurso', function(){

         it('incrementa a pontuação geral do aluno', function(){
            $idAluno = 1;
            $idCurso = 1;
            $valor = 12;
            $resultado = $this->repoAlunos->incrementarPontuacaoCurso($idAluno,$idCurso, $valor);

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

    describe('adicionar', function():void{

        it('adiciona um aluno', function(): void{
            $credencial = new Credenciais(0,
                                'teste@email.com',
                                '123456',
                                '');
            
            $idCredencial = $this->repoCredenciais->adicionar($credencial);
            $credencial->setId($idCredencial);

            $aluno = new Aluno(0,
                                'teste aluno',
                                0,
                                $credencial);

            $id = $this->repoAlunos->adicionar($aluno);

            $ps = $this->pdo->prepare(
                'SELECT id FROM aluno WHERE id = :id');
            $ps->execute(['id'=> $id]);
            expect($ps->rowCount())->toBeGreaterThan(0);
        });

        it('lança uma exceção ao adicionar um aluno sem uma credencial existente', function(): void{
            $credencial = new Credenciais(0,
                                '',
                                '',
                                '');

            $aluno = new Aluno(0,
                                'teste aluno',
                                0,
                                $credencial);

            expect(function () use ($aluno) {
                $this->repoAlunos->adicionar($aluno);
            })->toThrow(new RepositorioException());
        });

    });

    afterAll(function(){

        excluirBDTestes($this->pdo);
        
    });

});