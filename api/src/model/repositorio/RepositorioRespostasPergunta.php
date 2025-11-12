<?php

interface RepositorioRespostasPergunta{
    /**
     * Cadastra uma resposta para determinada pergunta.
     * @param RespostaPergunta $respostaPergunta
     * @return void
     */
    public function cadastrarResposta(RespostaPergunta $respostaPergunta): void;
}