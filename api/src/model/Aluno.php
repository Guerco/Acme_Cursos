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

    public function getcredenciais(): Credenciais{
        return $this->credenciais;
    }
    public function setcredenciais(Credenciais $credenciais): void{
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