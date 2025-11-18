<?php

interface GerenciadorDeSenha {

    /**
     * @return array{
     *     senha: string,
     *     sal: string
     * }
     */
    public function criarHash(string $senha): array;
    public function verificarSenha(string $senha, string $sal, string $hashSenha) : bool;
}