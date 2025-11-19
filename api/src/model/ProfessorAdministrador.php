<?php

class ProfessorAdministrador{
    
    public function __construct(
        private int $idProfessor = 0,
        private int $idAdministrador = 0,
        private string $nome = '',
        private ?Credenciais $credenciais = null
    ){}

    public function getId(): int{
        return $this->idProfessor;
    }
    public function setId(int $id): void{
        $this->idProfessor = $id;
        $this->idAdministrador = $id;
    }

    public function getIdProfessor(): int{
        return $this->idProfessor;
    }
    public function setIdProfessor(int $id): void{
        $this->idProfessor = $id;
    }

    public function getIdAdministrador(): int{
        return $this->idAdministrador;
    }
    public function setIdAdministrador(int $id): void{
        $this->idAdministrador = $id;
    }

    public function getNome(): string{
        return $this->nome;
    }
    public function setNome(string $nome): void{
        $this->nome = $nome;
    }

    public function getCredenciais(): ?Credenciais{
        return $this->credenciais;
    }
    public function setCredenciais(Credenciais $credenciais): void{
        $this->credenciais = $credenciais;
    }
} 