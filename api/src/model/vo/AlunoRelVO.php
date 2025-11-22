<?php

class AlunoRelVO {
    public function __construct(
        private int $posicao,
        private string $nome,
        private float $pontuacaoGeral
    ) {}

    public function getPosicao(): int { 
        return $this->posicao; 
    }

    public function getNome(): string { 
        return $this->nome; 
    }

    public function getPontuacaoGeral(): float { 
        return $this->pontuacaoGeral; 
    }
}
