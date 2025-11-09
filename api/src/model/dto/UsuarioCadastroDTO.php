<?php

class UsuarioCadastroDTO{

    public function __construct(
        public ?string $email = '',
        public ?string $senha = '',
        public ?string $nome = '',
        public ?string $tipoUsuario = ''
    ){}

    
    public static function deArray(array $dados): UsuarioCadastroDTO{
        return new self(
            $dados['email'],
            $dados['senha'],
            $dados['nome'],
            $dados['tipoUsuario']
        );
    }

    public static function deArrays(array $dados): array{
        $respostas = [];

        foreach($dados as $dado){
            $respostas[] = self::deArray($dado);
        }

        return $respostas;
    }
}