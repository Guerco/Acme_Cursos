<?php

class CursoQtdAlunoRelVO {
    public function __construct(
        private string $descricao,
        private int $quantidade
    ) {}

    public function getDescricao(): string { 
        return $this->descricao; 
    }

    public function getQuantidade(): int { 
        return $this->quantidade; 
    }

}
