<?php

class AutentificacaoEmArquivo implements Autentificacao {
    public function __construct(
        private GerenciadorDeSenha $gerenciadorDeSenha,
        private RepositorioCredenciais $repoCredenciais
    ) {}

    public function entrar(Credenciais $credenciais): UsuarioSessaoDTO {
        $hash = $this->gerenciadorDeSenha->gerarHashComSal(
            $credenciais->getSenha(),
            $credenciais->getSalSenha()
        );

        $credenciais->setSenha($hash);

        $usuario = $this->repoCredenciais->verificarCredenciais($credenciais);
        
        if ($usuario === false)
            throw new DominioException('Credenciais Inválidas');

        try {
            $this->iniciarSessao();

            session_regenerate_id();

            $tipoUsuario = TipoUsuario::tipoObjeto($usuario);

            if ($tipoUsuario === false) throw new DominioException('Tipo de usuário desconhecido.');

            $_SESSION['id_usuario'] = $usuario->getId();
            $_SESSION['tipo_usuario'] = $tipoUsuario->value;

            return new UsuarioSessaoDTO(
                $usuario->getNome(),
                $tipoUsuario->value
            );
        } catch (Throwable $th) {
             if ($th instanceof DominioException) {
                throw $th;
            }

            throw new ServidorException('Não foi possível iniciar a sessão.');
        }
    }

    public function sair(): void {
        $this->iniciarSessao();

        session_destroy();
    }

    public function buscarIdUsuario() : int {
        $this->iniciarSessao();

        return $_SESSION['id_usuario'] ?? 0;
    }

    public function buscarTipoUsuario() : string {
        $this->iniciarSessao();

        return $_SESSION['tipo_usuario'] ?? '';
    }

    public function estaLogado(): bool {
        $this->iniciarSessao();

        return isset($_SESSION['id_usuario']);
    }

    // Auxiliares
    private function iniciarSessao() {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_name('sid');

            session_set_cookie_params(
                0, 
                '/', 
                '', 
                false,
                true
            );

            session_start();
        }
    }
}