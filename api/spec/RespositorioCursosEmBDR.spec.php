<?php
require_once 'configBDTeste.php';

describe('RepositorioCursosEmBDR', function (){

    beforeAll(function(){

        $this->pdo = prepararBDTestes();
        $this->repo = new RepositorioCursosEmBDR($this->pdo);

    });

    describe('existeComId', function(){

        it('retorna se existe curso pelo id', function():void{
            $id = 1;
            $resultado = $this->repo->existeComId($id);
            expect($resultado)->toBeAn('bool');
            expect($resultado)->toBe(true);
        });
       
    });

    describe('listarCursos', function(){
        
        it('retorna um array de cursos', function():void{
            $resultado = $this->repo->listarCursos("");
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0] ?? null)->toBeAnInstanceOf(Curso::class);

        });

        it('retorna um array filtrado pelo o nome do professor', function():void{

            $resultado = $this->repo->listarCursos('Amaurício');
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->toBe(1);
            expect($resultado[0]->getProfessor()->getNome())->toContain('Amaurício');
            expect($resultado[0]?? null)->toBeAnInstanceOf(Curso::class);
        });

        it('retorna um array filtrado pelo o nome do curso', function():void{

            $resultado = $this->repo->listarCursos('Geografia');
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->toBe(1);
            expect($resultado[0]->getDescricao())->toContain('Geografia');
            expect($resultado[0]?? null)->toBeAnInstanceOf(Curso::class);
        });

    });

    afterAll(function(){

        excluirBDTestes($this->pdo);
        
    });


});

