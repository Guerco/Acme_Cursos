<?php

class RespostaPergunta{

    public function __construct(
        private int $id = 0,
        private ?Pergunta $pergunta = null,
        private string $descricao = '',
        private bool $correta = false
    ){}

    public function getPergunta(): ?Pergunta{
        return $this->pergunta;
    }
    public function setPergunta(Pergunta $pergunta): void{
        $this->pergunta = $pergunta;
    }

    public function getId(): int{
        return $this->id;
    }
    public function setId(int $id): void{
        $this->id = $id;
    }
    
    public function getDescricao(): string{
        return $this->descricao;
    }
    public function setDescricao(string $descricao): void{
        $this->descricao = $descricao;
    }

    public function isCorreta(): bool{
        return $this->correta;
    }
    public function setCorreta(bool $correta): void{
        $this->correta = $correta;
    }
    
}