<?php

class Aluno{
    
    public function __construct(
        private int $id = 0,
        private string $nome = '',
        private float $pontuacaoGeral = 0.0,
        private ?Usuario $usuario = null
    ){}

    public function getId(): int{
        return $this->id;
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

    public function getPontuacaoGeral(): float{
        return $this->pontuacaoGeral;
    }
    public function setPontuacaoGeral(float $pontuacaoGeral): void{
        $this->pontuacaoGeral = $pontuacaoGeral;
    }
} 