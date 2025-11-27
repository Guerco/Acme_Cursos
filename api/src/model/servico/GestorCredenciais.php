<?php

class GestorCredenciais
{
    
    public function __construct(
        private RepositorioCredenciais $repositorioCredenciais,
        private RepositorioAlunos $repositorioAluno,
        private RepositorioProfessores $repositorioProfessor,
        private RepositorioAdministradores $repositorioAdministrador,
        private GerenciadorDeTransacoes $transacao,
        private GerenciadorDeSenha $GerenciadorDeSenha,
        private Autenticacao $autenticacao,
        private Autorizacao $autorizacao
    ) { }

    /**
     * @param TipoUsuario[] $autorizados
     * @throws NaoAutorizadoException
     */
    private function autorizar (array $autorizados): void {
        $usuariosAutorizados = array_map(
            fn(TipoUsuario $tipo) => $tipo->value,
            $autorizados
        );

        $estaAutorizado = (
            $this->autenticacao->estaLogado() &&
            $this->autorizacao->verificarAutorizacao($usuariosAutorizados)
        );

        if (! $estaAutorizado) throw new NaoAutorizadoException('Não possui acesso a este recurso.');
    }

    /**
     * @return UsuarioListagemDTO[]
     */
    public function listarUsuarios(string $filtro): array {
        $this->autorizar(
            [
                TipoUsuario::PROFESSOR,
                TipoUsuario::ADMINISTRADOR,
                TipoUsuario::PROFESSOR_ADMINISTRADOR,
            ]
        );

        $usuarios = [];
        $resultado = [];

        $usuarios = $this->repositorioCredenciais->listarTodos($filtro);

        $resultado = UsuarioListagemDTO::deObjetosParaDTO($usuarios);

        return $resultado;
    }

    public function criarUsuario(UsuarioCadastroDTO $usuario): void {
        $this->autorizar(
            [
                TipoUsuario::ADMINISTRADOR,
                TipoUsuario::PROFESSOR_ADMINISTRADOR,
            ]
        );

        $problemas = $this->validarUsuario($usuario);

        if (!empty($problemas)) {
            throw DominioException::comProblemas($problemas);
        }

        $hash = $this->GerenciadorDeSenha->criarHash((string) $usuario->senha);

        $credenciais = new Credenciais(
            0,
            (string) $usuario->email,
            $hash['senha'],
            $hash['sal']
        );

        $this->transacao->iniciar();

        try{
            $idCredenciais = $this->repositorioCredenciais->adicionar($credenciais);
            $credenciais->setId($idCredenciais);

            switch ($usuario->tipoUsuario) {
                case 'aluno':
                    $aluno = new Aluno(
                        0,
                        (string) $usuario->nome,
                        0,
                        $credenciais
                    );
                    $resultado = $this->repositorioAluno->adicionar($aluno);
                    break;

                case 'professor':
                    $professor = new Professor(
                        0,
                        (string) $usuario->nome,
                        $credenciais
                    );
                    $resultado = $this->repositorioProfessor->adicionar(professor: $professor);
                    break;

                case 'administrador':
                    $administrador = new Administrador(
                        0,
                        (string) $usuario->nome,
                        $credenciais
                    );
                    $resultado = $this->repositorioAdministrador->adicionar($administrador);
                    break;

                case 'professor-administrador':
                    $administrador = new Administrador(
                        0,
                        (string) $usuario->nome,
                        $credenciais
                    );
                    $professor = new Professor(
                        0,
                        (string) $usuario->nome,
                        $credenciais
                    );
                    $resultado = $this->repositorioAdministrador->adicionar($administrador);
                    $resultado = $this->repositorioProfessor->adicionar($professor);
                    break;
            }
            

            
            $this->transacao->confirmar();

        } catch (Throwable $e){
            $this->transacao->reverter();
            throw $e;
        } 
    }

    /**
     * @param UsuarioCadastroDTO $usuario
     * @return string[]
     */
    private function validarUsuario(UsuarioCadastroDTO $usuario): array {
        $problemas = [];
        
        if (!in_array($usuario->tipoUsuario, 
        ['aluno', 'professor', 'administrador', 'professor-administrador'])
        ) {
            $problemas[] = "Tipo de usuário desconhecido.";
        }

        if (!$usuario->email) {
            $problemas[] = 'O email deve ser preenchido.';
        } 

        if (!$usuario->senha) {
            $problemas[] = 'A senha deve ser preenchida.';
        }

        if ($this->repositorioCredenciais->buscarPorEmail((string) $usuario->email) !== false) {
            $problemas[] = 'Este e-mail já está cadastrado.';
        }

        $credenciais = new Credenciais();
        $credenciais->setEmail((string) $usuario->email);
        $credenciais->setSenha((string) $usuario->senha);
        $problemasCredenciais = $credenciais->validar();

        if ($problemasCredenciais) {
            $problemas = array_merge($problemas, $problemasCredenciais);
        }  

        if (!$usuario->nome) {
            $problemas[] = 'O nome deve ser preenchido.';
        } else if (strlen($usuario->nome) < 2 || strlen($usuario->nome) > 100) {
            $problemas[] = 'O nome deve ter de 2 a 100 caracteres.';
        }

        return $problemas;
    }

}
