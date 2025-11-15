<?php

class GestorCredenciais
{

    public function __construct(
        private RepositorioCredenciais $repositorioCredenciais,
        private RepositorioAlunos $repositorioAluno,
        private RepositorioProfessores $repositorioProfessor,
        private RepositorioAdministradores $repositorioAdministrador,
        private GerenciadorDeTransacoes $transacao
    ) {}

    /**
     * @return UsuarioListagemDTO[]
     */
    public function listarUsuarios(): array {
        $usuarios = [];
        $resultado = [];

        $usuarios = $this->repositorioCredenciais->listarTodos();

        $resultado = UsuarioListagemDTO::deObjetosParaDTO($usuarios);

        return $resultado;
    }

    public function criarUsuario(UsuarioCadastroDTO $usuario): void {

        $problemas = $this->validarUsuario($usuario);

        if (!empty($problemas)) {
            throw DominioException::comProblemas($problemas);
        }
        $salSenha = $this->criarSalSenha();

        $credenciais = new Credenciais(
            0,
            $usuario->email,
            $usuario->senha,
            $salSenha
        );

        $this->transacao->iniciar();

        try{
            $idCredenciais = $this->repositorioCredenciais->adicionar($credenciais);
            $credenciais->setId($idCredenciais);

            switch ($usuario->tipoUsuario) {
                case 'aluno':
                    $aluno = new Aluno(
                        0,
                        $usuario->nome,
                        0,
                        $credenciais
                    );
                    $resultado = $this->repositorioAluno->adicionar($aluno);
                    break;

                case 'professor':
                    $professor = new Professor(
                        0,
                        $usuario->nome,
                        $credenciais
                    );
                    $resultado = $this->repositorioProfessor->adicionar(professor: $professor);
                    break;

                case 'administrador':
                    $administrador = new Administrador(
                        0,
                        $usuario->nome,
                        $credenciais
                    );
                    $resultado = $this->repositorioAdministrador->adicionar($administrador);
                    break;
            }
            $this->transacao->confirmar();

        } catch (Throwable $e){
            $this->transacao->reverter();
            throw $e;
        } 
    }

    private function validarUsuario(UsuarioCadastroDTO $usuario): array {
        $problemas = [];

        if (!in_array($usuario->tipoUsuario, ['aluno', 'professor', 'administrador'])) {
            $problemas[] = 'Tipo usuario desconhecido.';
        }

        if (!$usuario->email) {
            $problemas[] = 'O email deve ser preenchido.';
        } 

        if (!$usuario->senha) {
            $problemas[] = 'A senha deve ser preenchida.';
        }

        if ($this->repositorioCredenciais->buscarPorEmail($usuario->email)) {
            $problemas[] = 'Este e-mail já está cadastrado.';
        }

        $credenciais = new Credenciais();
        $credenciais->setEmail($usuario->email);
        $credenciais->setSenha($usuario->senha);
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

    private function criarSalSenha(): string {
        return '';
    }
}
