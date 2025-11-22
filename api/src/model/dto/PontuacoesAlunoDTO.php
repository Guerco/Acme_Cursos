<?php

class PontuacoesAlunoDTO{

    public function __construct(
        public string $descricaoAssunto,
        public float $pontuacaoGeral,
        public float $pontuacaoCurso
    ){}
}