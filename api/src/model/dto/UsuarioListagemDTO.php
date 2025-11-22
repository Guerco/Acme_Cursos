<?php

class UsuarioListagemDTO{

    public function __construct(
        public string $tipoUsuario,
        public string $nome,
        public string $email
    ){}

    public static function deObjetoParaDTO(object $objeto): UsuarioListagemDTO{
        /** @var Aluno|Professor|Administrador|ProfessorAdministrador $objeto */
        $tipo = self::tipoUsuario($objeto);

        /**
         * @var Credenciais
         */
        $credenciais = $objeto->getCredenciais();
        return new Self(
            $tipo,
            $objeto->getNome(),
            $credenciais->getEmail()
        );
    }

    /**
     * @param object[] $usuarios
     * @return UsuarioListagemDTO[]
     */
    public static function deObjetosParaDTO(array $usuarios): array{
        $usuariosDTO = [];

        foreach($usuarios as $usuario){
       
            $usuariosDTO[] = Self::deObjetoParaDTO($usuario);
        }

        return $usuariosDTO;
    }

    private static function tipoUsuario(object $usuario): string{

        $classe = get_class($usuario);
    
        if (strpos($classe, 'Aluno') !== false) {
            return 'Aluno';
        } else if (strpos($classe, 'ProfessorAdministrador') !== false) {
            return 'Professor-Administrador';
        } else if (strpos($classe, 'Professor') !== false) {
            return 'Professor';
        } else if (strpos($classe, 'Administrador') !== false) {
            return 'Administrador';
        } else {
            throw new DominioException('Tipo usuario desconhecido');
        }
    }
}