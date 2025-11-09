<?php

interface RepositorioCredenciais{

    /**
     * Cria uma credencial
     * @param Credenciais $credenciais
     * @return int
     */
    public function adicionar(Credenciais $credenciais): int;

    /**
     * Verifica se um email já existe
     * @param string $email
     * @return bool
     */
    public function buscarPorEmail(string $email) :bool;

    /**
     * Retorna todos os usuários
     * @return array<Professor|Aluno|Administrador>
     */
    public function listarTodos(): array;
}