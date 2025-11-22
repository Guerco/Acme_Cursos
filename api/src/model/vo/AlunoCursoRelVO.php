<?php

class AlunoCursoRelVO {
    public function __construct(
        private string $descricao,
        private int $posicao,
        private string $nomeAluno,
        private float $pontuacao
    ) {}

    public function getDescricao(): string { 
        return $this->descricao; 
    }

    public function getPosicao(): int { 
        return $this->posicao; 
    }

    public function getNomeAluno(): string { 
        return $this->nomeAluno; 
    }

    public function getPontuacao(): float { 
        return $this->pontuacao; 
    }
}
