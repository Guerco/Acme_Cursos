<?php

class Aluno{
    
    public function __construct(
        private int $id = 0,
        private string $nome = '',
        private float $pontuacaoGeral = 0.0,
        private ?Credenciais $credenciais = null
    ){}

    public function getId(): int{
        return $this->id;
    }
    public function setId(int $id): void{
        $this->id = $id;
    }

    public function getCredenciais(): Credenciais{
        return $this->credenciais;
    }
    public function setCredenciais(Credenciais $credenciais): void{
        $this->credenciais = $credenciais;
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