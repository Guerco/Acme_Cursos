<?php
require_once 'configBDTeste.php';

describe('RepositorioProfessoresEmBDR', function (){

    beforeAll(function(){

        $this->pdo = prepararBDTestes();
        $this->repoProfessores = new RepositorioProfessoresEmBDR($this->pdo);
        $this->repoCredenciais = new RepositorioCredenciaisEmBDR($this->pdo);

    });

    describe('adicionar', function():void{

        it('adiciona um professor', function(): void{
            $credencial = new Credenciais(0,
                                'teste@email.com',
                                '123456',
                                '');
            
            $idCredencial = $this->repoCredenciais->adicionar($credencial);
            $credencial->setId($idCredencial);

            $professor = new Professor(0,
                                'teste professor',
                                $credencial);

            $id = $this->repoProfessores->adicionar($professor);

            $ps = $this->pdo->prepare(
                'SELECT id FROM professor WHERE id = :id');
            $ps->execute(['id'=> $id]);
            expect($ps->rowCount())->toBeGreaterThan(0);
        });

        it('lança uma exceção ao adicionar um professor sem uma credencial existente', function(): void{
            $credencial = new Credenciais(0,
                                '',
                                '',
                                '');

            $professor = new Professor(0,
                                'teste professor',
                                $credencial);

            expect(function () use ($professor) {
                $this->repoProfessores->adicionar($professor);
            })->toThrow(new RepositorioException());
        });

    });

    afterAll(function(){

        excluirBDTestes($this->pdo);
        
    });

});

