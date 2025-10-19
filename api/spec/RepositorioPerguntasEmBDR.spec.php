<?php
require_once 'configBDTeste.php';

describe('RepositorioPerguntasEmBDR', function(){
 
    $resultado = [];

    beforeAll(function(){

        $this->pdo = prepararBDTestes();
        $this->repo = new RepositorioPerguntasEmBDR($this->pdo);

    });

    describe('existeComId', function(){

        it('retorna se existe pergunta pelo id', function(){
            $id = 1;
            $resultado = $this->repo->existeComId($id);
            expect($resultado)->toBeAn('bool');
            expect($resultado)->toBe(true);
        });
       
    });

    describe('buscarCursoEDificuldadePeloID', function(){

        it('retorna a dificuldade e o id da pergunta', function(){
            $id = 1;
            $resultado = $this->repo->buscarCursoEDificuldadePeloID($id);
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado['dificuldade'] ?? null)->toBe('dificil');
            expect($resultado['idCurso'] ?? null)->toBe(2);
        });

    });

    describe('buscarPorAssuntoEAluno', function(){

        it('retorna um array de perguntas nao respondidas pelo aluno em determinado assunto', function(){
            $idAssunto = 3;
            $idAluno = 1;
            $resultado = $this->repo->buscarPorAssuntoEAluno($idAssunto,$idAluno);
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0] ?? null)->toBeAnInstanceOf(Pergunta::class);

        }); 

         it('retorna um array vazio quando eu passo um assunto já respondido pelo aluno', function(){
            $idAssunto = 1;
            $idAluno = 1;
            $resultado = $this->repo->buscarPorAssuntoEAluno($idAssunto,$idAluno);
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->toBe(0);
        });

    });

    describe('buscarIdsRespostasCorretas', function(){

        it('retorna as respostas corretas de determinada pergunta', function(){
            $idPergunta = 1;
            $resultado = $this->repo->buscarIdsRespostasCorretas($idPergunta);
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado['0'] ?? null)->toBe(2);
        });

    });

    afterAll(function(){

        excluirBDTestes($this->pdo);
        
    });

});