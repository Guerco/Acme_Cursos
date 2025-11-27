<?php

class GestorLogin {

    public function __construct(
        private Autenticacao $autenticacao,
        private RepositorioCredenciais $repoCredenciais
    ) {}

    /**
     * @param array<string|mixed> $dados
     * @return UsuarioSessaoDTO
     * @throws DominioException
     */
    public function entrar(array $dados): UsuarioSessaoDTO {

        $this->verificarDadosLogin($dados);
        
        $sal = $this->repoCredenciais->buscarPorEmail($dados["email"]);
        if (! $sal) {
            throw new DominioException('Credenciais Inválidas.');
        }
        
        $credenciais = new Credenciais(
            0,
            $dados['email'],
            $dados['senha'],
            (string) $sal
        );

        return $this->autenticacao->entrar($credenciais);
    }

    /**
     * @throws DominioException
     * @return void
     */
    public function sair() {

        $this->autenticacao->sair();
    }

    // Validação
    /**
     * @param array<string, mixed> $dados
     *
     * @throws DominioException
     */
    private function verificarDadosLogin(array $dados): void
    {
        $formatoEsperado = [
            'email' => [
                'tipo' => TiposCampos::STRING,
                'obrigatorio' => true,
            ],
            'senha' => [
                'tipo' => TiposCampos::STRING,
                'obrigatorio' => true,
            ]
        ];
        
        $problemas = Validador::validarArraySchema($dados, $formatoEsperado);

        if (!empty($problemas))
            throw DominioException::comProblemas($problemas);
    }

}