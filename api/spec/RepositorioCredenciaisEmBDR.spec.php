<?php
require_once 'configBDTeste.php';

describe('RepositorioCredenciaisEmBDR', function (){

    beforeAll(function(){

        $this->pdo = prepararBDTestes();
        $this->repo = new RepositorioCredenciaisEmBDR($this->pdo);

    });

    describe('listarTodos', function(){
        
        it('retorna um array de usuarios', function():void{
            $resultado = $this->repo->listarTodos();
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);

            foreach ($resultado as $usuario) {
                $resultado2 = 
                    $usuario instanceof Administrador ||
                    $usuario instanceof Professor || 
                    $usuario instanceof Aluno;     
                expect($resultado2)->toBe(true);
            }
        });

        it('lança uma exceção ao retornar um tipo de usuário que não existe', function():void{

            $idCredenciais = $this->repo->adicionar(
                new Credenciais(0,
                                'teste@email.com',
                                '123456',
                                '')
                                );
            expect(function () {
                $this->repo->listarTodos();
            })->toThrow(new RepositorioException('O tipo de usuário não existe.'));

            $ps = $this->pdo->prepare("DELETE from credenciais where id = :idCredenciais");
            $ps->execute(['idCredenciais' => $idCredenciais]);

        });

    });

    describe('adicionar', function():void{

        it('adiciona uma credencial', function(): void{
            $credencial = new Credenciais(0,
                                'teste@email.com',
                                '123456',
                                '');
    
            $idCredencial = $this->repo->adicionar($credencial);

            $ps = $this->pdo->prepare(
                'SELECT id FROM credenciais WHERE id = :idCredencial');
            $ps->execute(['idCredencial'=> $idCredencial]);
            expect($ps->rowCount())->toBeGreaterThan(0);
        });

        it('lança uma exceção ao adicionar uma credencial com um email existente', function ():void{
            $credencial = new Credenciais(0,
                                'teste@email.com',
                                '123456',
                                '');

           expect(function () use ($credencial) {
                $this->repo->adicionar($credencial);
            })->toThrow(new RepositorioException());

        });

    });

    describe('buscarPorEmail', function():void{

        it('retorna true quando encontrar um email', function ():void{
            $resultado = $this->repo->buscarPorEmail('teste@email.com');
            expect($resultado)->toBeAn('bool');
            expect($resultado)->toBe(true);
        });

        it('retorna false quando não encontrar um email', function ():void{
            $resultado = $this->repo->buscarPorEmail('teste2@email.com');
            expect($resultado)->toBeAn('bool');
            expect($resultado)->toBe(false);
        });

    });

    afterAll(function(){

        excluirBDTestes($this->pdo);
        
    });

});

