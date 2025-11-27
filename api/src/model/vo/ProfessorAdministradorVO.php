<?php

class ProfessorAdministradorVO{
    
    public function __construct(
        private int $id,
        private string $nome,
        private Credenciais $credenciais
    ){}

    public function getId(): int{
        return $this->id;
    }

    public function getNome(): string{
        return $this->nome;
    }

    public function getCredenciais(): Credenciais{
        return $this->credenciais;
    }
  
} 