<?php

class UsuarioCadastroDTO{

    public function __construct(
        public ?string $email = '',
        public ?string $senha = '',
        public ?string $nome = '',
        public ?string $tipoUsuario = ''
    ){}

    
    /**
     * @param array{
     *     email: string,
     *     senha: string,
     *     nome: string,
     *     tipoUsuario: string
     * } $dados
     */
    public static function deArray(array $dados): UsuarioCadastroDTO{
        return new self(
            $dados['email'],
            $dados['senha'],
            $dados['nome'],
            $dados['tipoUsuario']
        );
    }

    /**
     * @param array{
     *     email: string,
     *     senha: string,
     *     nome: string,
     *     tipoUsuario: string
     * }[] $dados
     * 
     * @return UsuarioCadastroDTO[]
     */
    public static function deArrays(array $dados): array{
        $respostas = [];

        foreach($dados as $dado){
            $respostas[] = self::deArray($dado);
        }

        return $respostas;
    }
}