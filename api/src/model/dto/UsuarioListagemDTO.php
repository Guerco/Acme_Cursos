<?php

class UsuarioListagemDTO{

    public function __construct(
        public string $tipoUsuario,
        public string $nome,
        public string $email
    ){}

    public static function deObjetoParaDTO($objeto): UsuarioListagemDTO{
        $tipo = self::tipoUsuario($objeto);
        return new Self(
            $tipo,
            $objeto->getNome(),
            $objeto->getCredenciais()->getEmail()
        );
    }

    public static function deObjetosParaDTO(array $usuarios): array{
        $usuariosDTO = [];

        foreach($usuarios as $usuario){
       
            $usuariosDTO[] = Self::deObjetoParaDTO($usuario);
        }

        return $usuariosDTO;
    }

    private static function tipoUsuario($usuario){

        $classe = get_class($usuario);
    
        if (strpos($classe, 'Aluno') !== false) {
            return 'aluno';
        } else if (strpos($classe, 'Professor') !== false) {
            return 'professor';
        } else if (strpos($classe, 'Administrador') !== false) {
            return 'administrador';
        } else {
            throw new NaoEncontradoException('Tipo usuario desconhecido');
        }
    }
}