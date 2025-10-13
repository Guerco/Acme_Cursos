<?php

class Pergunta{

    public function __construct(
        private int $id = 0,
        private ?Assunto $assunto,
        private string $descricao = '',
        private ?string $caminhoImg = '',
        private int $tempoSeg = 60,
        private Dificuldade $dificuldade = Dificuldade::FACIL,
        private array $respostas = []
    ){}

    public function getAssunto(): Assunto{
        return $this->assunto;
    }
    public function setAssunto(Assunto $assunto): void{
        $this->assunto = $assunto;
    }
    
    public function getId(): int{
        return $this->id;
    }

    public function getDescricao(): string{
        return $this->descricao;
    }
    public function setDescricao(string $descricao): void{
        $this->descricao = $descricao;
    }

    public function getCaminhoImg(): ?string{
        return $this->caminhoImg;
    }
    public function setCaminhoImg(string $caminhoImg): void{
        $this->caminhoImg = $caminhoImg;
    }

    public function getTempoSeg(): int{
        return $this->tempoSeg;
    }
    public function setTempoSeg(int $tempoSeg): void{
        $this->tempoSeg = $tempoSeg;
    }

    public function getDificuldade(): Dificuldade{
        return $this->dificuldade;
    }
    public function setDificuldade(Dificuldade $dificuldade): void{
        $this->dificuldade = $dificuldade;
    }

    public function getRespostas(): array{
        return $this->respostas;
    }
    public function setRespostas(array $respostas): void{
        $this->respostas = $respostas;
    }

    public function addResposta(RespostaPergunta $resposta): void{
        $this->respostas []= $resposta;
    }
}