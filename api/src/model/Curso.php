<?php

class Curso{

    /**
     * @param Assunto[] $assuntos
     */
    public function __construct(
        private ?Professor $professor,
        private int $id = 0,
        private string $descricao = '',
        private string $caminhoImg = '',
        private array $assuntos = []
    ){}

    public function getProfessor(): ?Professor{
        return $this->professor;
    }
    public function setProfessor(Professor $professor): void{
        $this->professor = $professor;
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

    public function getCaminhoImg(): string{
        return $this->caminhoImg;
    }
    public function setCaminhoImg(string $caminhoImg): void{
        $this->caminhoImg = $caminhoImg;
    }

    /**
     * @return Assunto[]
     */
    public function getAssuntos(): array{
        return $this->assuntos;
    }

    /**
     * @param Assunto[] $assuntos
     */
    public function setAssuntos(array $assuntos): void{
        $this->assuntos = $assuntos;
    }

    public function addAssunto(Assunto $assunto): void{
        $this->assuntos[] = $assunto;
    }

    
}