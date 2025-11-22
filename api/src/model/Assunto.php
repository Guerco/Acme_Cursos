<?php

class Assunto{

    /**
     * @param Pergunta[] $perguntas
     */
    public function __construct(
        private ?Curso $curso,
        private int $id = 0,
        private string $descricao = '',
        private array $perguntas = []
    ){}

    public function getCurso(): ?Curso{
        return $this->curso;
    }
    public function setCurso(Curso $curso): void{
        $this->curso = $curso;
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

    /**
     * @return Pergunta[]
     */
    public function getPerguntas(): array{
        return $this->perguntas;
    }

    /**
     * @param Pergunta[] $perguntas
     */
    public function setPerguntas(array $perguntas): void{
        $this->perguntas = $perguntas;
    }

    public function addPergunta(Pergunta $pergunta): void{
        $this->perguntas[] = $pergunta;
    }

}