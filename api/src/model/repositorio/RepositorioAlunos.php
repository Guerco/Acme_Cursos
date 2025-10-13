<?php

interface RepositorioAlunos {
    /**
     * Verifica se existe um usuário com determinadas credenciais e retorna seu id.
     * 
     * @param Credenciais $credenciais
     * @return int
     */
    function existeComCredenciais(Credenciais $credenciais): int;
}