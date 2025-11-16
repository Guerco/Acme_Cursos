<?php

use Kahlan\Plugin\Double;

function criarUsuarioTeste($tipoUsuario = '', $nome = '', $email = ''): object{
    $credenciais = new Credenciais();
    $credenciais->setEmail($email);

    switch ($tipoUsuario) {
                case 'Administrador':
                    $usuario = new Administrador();
                    break;
                case 'Professor':
                    $usuario = new Professor();
                    break;
                case 'Aluno':
                    $usuario = new Aluno();
                    break;
                default:
                    $usuario = new class {
                        private $nome;
                        private $credenciais;
                        
                        public function setNome($nome) { 
                            $this->nome = $nome; 
                        }
                        public function setCredenciais($credenciais) { 
                            $this->credenciais = $credenciais; 
                        }
                    };
            }

    $usuario->setNome($nome);
    $usuario->setCredenciais($credenciais);
    
    return $usuario;
}

describe('GestorCredenciais', function(): void{

    beforeEach(function(): void{
        $this->repositorioTesteCredenciais = Double::instance(['implements' => RepositorioCredenciais::class]);
        $this->repositorioTesteAlunos = Double::instance(['implements' => RepositorioAlunos::class]);
        $this->repositorioTesteProfessores = Double::instance(['implements' => RepositorioProfessores::class]);
        $this->repositorioTesteAdministradores = Double::instance(['implements' => RepositorioAdministradores::class]);
        
        $this->gerenciadorTransacoes = Double::instance([
            'implements' => GerenciadorDeTransacoes::class,
        ]);
        allow($this->gerenciadorTransacoes)->toReceive('iniciar');
        allow($this->gerenciadorTransacoes)->toReceive('confirmar');
        allow($this->gerenciadorTransacoes)->toReceive('reverter');
        
        $this->gestorCredenciais = new GestorCredenciais(
            $this->repositorioTesteCredenciais,
            $this->repositorioTesteAlunos,
            $this->repositorioTesteProfessores,
            $this->repositorioTesteAdministradores,
            $this->gerenciadorTransacoes
        );
    });

    describe('listarUsuarios', function():void{

        it('retorna um array de objetos de UsuarioListagemDTO', function():void{
            allow($this->repositorioTesteCredenciais)->toReceive('listarTodos')->andReturn([
                criarUsuarioTeste('Administrador','Usuario adm', 'adm@email.com'),
                criarUsuarioTeste('Aluno','Usuario aluno', 'aluno@email.com'),
                criarUsuarioTeste('Professor','Usuario professor', 'professor@email.com')
            ]);

            $resultado = $this->gestorCredenciais->listarUsuarios();
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0]?? null)->toBeAnInstanceOf(UsuarioListagemDTO::class);
        });

        it('lança uma exceção ao informar um tipo de usuário desconhecido', function():void{
            allow($this->repositorioTesteCredenciais)->toReceive('listarTodos')->andReturn([
                criarUsuarioTeste('desconhecido','Usuario desconhecido', 'desconhecido@email.com')
            ]);   
            
            expect(function () {
                $this->gestorCredenciais->listarUsuarios();
            })->toThrow(new NaoEncontradoException('Tipo usuario desconhecido'));
        });
    });

    describe('criarUsuario', function():void{

        it('envia usuário do tipo Administrador', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '123456',
                'teste usuario',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('adicionar')->andReturn(1);
            allow($this->repositorioTesteAdministradores)->toReceive('adicionar')->andReturn(1);
            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->not->toThrow();
        });

        it('envia um usuário do tipo Aluno', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '123456',
                'teste usuario',
                ['aluno']);

            allow($this->repositorioTesteCredenciais)->toReceive('adicionar')->andReturn(1);
            allow($this->repositorioTesteAlunos)->toReceive('adicionar')->andReturn(1);
            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->not->toThrow();
        });

        it('envia um usuário do tipo Professor', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '123456',
                'teste usuario',
                ['professor']);

            allow($this->repositorioTesteCredenciais)->toReceive('adicionar')->andReturn(1);
            allow($this->repositorioTesteProfessores)->toReceive('adicionar')->andReturn(1);
            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->not->toThrow();
        });

        it('lança uma exceção ao informar um tipo de usuário desconhecido', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '123456',
                'teste usuario',
                ['desconhecido']);

            allow($this->repositorioTesteCredenciais)->toReceive('adicionar')->andReturn(1);
            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('Tipo de usuário desconhecido.'));
        });

        it('lança uma exceção ao informar um email que já existe', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '123456',
                'teste usuario',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(true);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('Este e-mail já está cadastrado.'));
        });

        it('lança uma exceção ao informar um email vazio', function():void{
            $usuario = new UsuarioCadastroDTO(
                '',
                '123456',
                'teste usuario',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('O email deve ser preenchido.|Formato do email inválido.'));
        });

        it('lança uma exceção ao informar uma senha vazia', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '',
                'teste usuario',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('A senha deve ser preenchida.|A senha deve conter no mínimo 6 caracteres.'));
        });

        it('lança uma exceção ao informar um email com formato inválido', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste.com',
                '123456',
                'teste usuario',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('Formato do email inválido.'));
        });

        it('lança uma exceção ao informar um email com mais de 100 caracteres', function():void{
            $emailInvalido = str_repeat('a', 101);
            $usuario = new UsuarioCadastroDTO(
                $emailInvalido,
                '123456',
                'teste usuario',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('Formato do email inválido.|O email  deve conter no máximo 100 caracteres.'));
        });

        it('lança uma exceção ao informar uma senha com menos de 6 caracteres', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '12345',
                'teste usuario',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('A senha deve conter no mínimo 6 caracteres.'));
        });

        it('lança uma exceção ao informar uma senha com mais de 200 caracteres', function():void{
            $senhaInvalida = str_repeat('1', 201);
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                $senhaInvalida,
                'teste usuario',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('A senha deve conter no máximo 200 caracteres.'));

        });

        it('lança uma exceção ao informar uma nome vazio', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '123456',
                '',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('O nome deve ser preenchido.'));
        });

        it('lança uma exceção ao informar uma nome com menos de 2 caracteres ou mais de 100', function():void{
            $usuario = new UsuarioCadastroDTO(
                'teste@email.com',
                '123456',
                'T',
                ['administrador']);

            allow($this->repositorioTesteCredenciais)->toReceive('buscarPorEmail')->andReturn(false);

            expect(function () use ($usuario) {
                $this->gestorCredenciais->criarUsuario($usuario);
            })->toThrow(new DominioException('O nome deve ter de 2 a 100 caracteres.'));
        });

    });
    
});