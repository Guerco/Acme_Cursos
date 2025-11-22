<?php

class PontuacaoCurso{
    public function __construct(
        private ?Curso $curso = null,
        private ?Aluno $aluno = null,
        private ?float $pontuacao = 0,
        private ?int $id = 0,
    ){}

    public function getCurso(): ?Curso{
        return $this->curso;
    }
    public function setCurso(Curso $curso): void{
        $this->curso = $curso;
    }

    public function getAluno(): ?Aluno{
        return $this->aluno;
    }
    public function setAluno(Aluno $aluno): void{
        $this->aluno = $aluno;
    }

    public function getPontuacao(): float|null{
        return $this->pontuacao;
    }

    public function setPontuacao(float $pontuacao): void{
        $this->pontuacao = $pontuacao;
    }

    public function getId(): ?int{
        return $this->id;
    }
    
    public function setId(int $id): void{
        $this->id = $id;
    }
}