<?php

interface RepositorioCredenciais{

    /**
     * Cria uma credencial
     * @param Credenciais $credenciais
     * @return int
     */
    public function adicionar(Credenciais $credenciais): int;

    /**
     * Verifica se um email existe e retorna salSenha se existir
     * @param string $email
     * @return bool|string
     */
    public function buscarPorEmail(string $email) :bool|string;

    /**
     * Retorna todos os usuários ou filtrados pelo nome;
     * @return array<Professor|Aluno|Administrador|ProfessorAdministrador>
     */
    public function listarTodos(string $filtro): array;

    /**
     * Retorna o usuário de determinadas credenciais
     * 
     * @return Professor|Aluno|Administrador|ProfessorAdministrador|false
     */
    public function verificarCredenciais(Credenciais $credenciais): Professor|Aluno|Administrador|ProfessorAdministrador|false;
}