<?php


class Credenciais{

    public function __construct(
        private ?int $id = 0,
        private string $email = '',
        private string $senha = ''
    ){}

    public function getId(): int{
        return $this->id;
    }

    public function getEmail(): string{
        return $this->email;
    }
    public function setEmail(string $email): void{
        $this->email = $email;
    }

    public function getSenha(): string{
        return $this->senha;
    }
    public function setSenha(string $senha): void{
        $this->senha = $senha;
    }

    /**
     * @return string[]
     */
    public function validar(): array {
        $problemas = [];
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $problemas []= 'Email inválido.';
        }
        return $problemas;
    }
}