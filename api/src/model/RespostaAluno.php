<?php

class RespostaAluno{

    public function __construct(
        private Aluno $aluno,
        private Pergunta $pergunta,
        private int $id = 0,
        private bool $respostaCorreta = false        
    ){}

    public function getAluno(): Aluno{
        return $this->aluno;
    }
    public function setAluno(Aluno $aluno): void{
        $this->aluno = $aluno;
    }
    
    public function getPergunta(): Pergunta{
        return $this->pergunta;
    }
    public function setPergunta(Pergunta $pergunta): void{
        $this->pergunta = $pergunta;
    }

    public function getId(): int{
        return $this->id;
    }

    public function isRespostaCorreta(): bool{
        return $this->respostaCorreta;
    }
    public function setRespostaCorreta(bool $respostaCorreta): void{
        $this->respostaCorreta = $respostaCorreta;
    }
}