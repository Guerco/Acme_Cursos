<?php

class Professor{
    
    public function __construct(
        private int $id = 0,
        private string $nome = '',
        private ?Usuario $usuario = null
    ){}

    public function getId(): int{
        return $this->id;
    }
    public function setId(int $id): void{
        $this->id = $id;
    }

    public function getUsuario(): Usuario{
        return $this->usuario;
    }
    public function setUsuario(Usuario $usuario): void{
        $this->usuario = $usuario;
    }

    public function getNome(): string{
        return $this->nome;
    }
    public function setNome(string $nome): void{
        $this->nome = $nome;
    }
} 