<?php


class Credenciais{

    public function __construct(
        private ?int $id = 0,
        private string $email = '',
        private string $senha = '',
        private string $salSenha = ''
    ){}

    public function getId(): ?int{
        return $this->id;
    }
    public function setId(int $id): void{
        $this->id = $id;
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

    public function getSalSenha(): string{
        return $this->salSenha;
    }
    public function setSalSenha(string $senha): void{
        $this->senha = $senha;
    }

    /**
     * @return string[]
     */
    public function validar(): array {
        $expressao = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
        $problemas = [];

        if (!preg_match($expressao, $this->email)) {
            $problemas []= 'Formato do email inválido.';
        }
        if (strlen($this->email) > 100) {
            $problemas []= 'O email  deve conter no máximo 100 caracteres.';
        }

        if (strlen($this->senha) < 6) {
            $problemas[] = 'A senha deve conter no mínimo 6 caracteres.';
        } else if(strlen($this->senha) > 200) {
            $problemas[] = 'A senha deve conter no máximo 200 caracteres.';
        }

        return $problemas;
    }
}