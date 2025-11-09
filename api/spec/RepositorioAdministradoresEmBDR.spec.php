<?php
require_once 'configBDTeste.php';

describe('RepositorioAdministradoresEmBDR', function (){

    beforeAll(function(){

        $this->pdo = prepararBDTestes();
        $this->repoAdm = new RepositorioAdministradoresEmBDR($this->pdo);
        $this->repoCredenciais = new RepositorioCredenciaisEmBDR($this->pdo);

    });

    describe('adicionar', function():void{

        it('adiciona um administrador', function(): void{
            $credencial = new Credenciais(0,
                                'teste@email.com',
                                '123456',
                                '');
            
            $idCredencial = $this->repoCredenciais->adicionar($credencial);
            $credencial->setId($idCredencial);

            $administrador = new Administrador(0,
                                'teste administrador',
                                $credencial);

            $id = $this->repoAdm->adicionar($administrador);

            $ps = $this->pdo->prepare(
                'SELECT id FROM administrador WHERE id = :id');
            $ps->execute(['id'=> $id]);
            expect($ps->rowCount())->toBeGreaterThan(0);
        });

        it('lança uma exceção ao adicionar um adminstrador sem uma credencial existente', function(): void{
            $credencial = new Credenciais(0,
                                '',
                                '',
                                '');

            $administrador = new Administrador(0,
                                'teste administrador',
                                $credencial);

            expect(function () use ($administrador) {
                $this->repoAdm->adicionar($administrador);
            })->toThrow(new RepositorioException());
        });

    });

    afterAll(function(){

        excluirBDTestes($this->pdo);
        
    });

});

