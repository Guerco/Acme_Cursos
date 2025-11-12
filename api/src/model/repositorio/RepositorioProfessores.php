<?php

interface RepositorioProfessores{
    /**
     * Verifica se existe um professor com determinado id.
     * 
     * @param int $id
     * @return bool
     */
    public function existeComId(int $id): bool;
    
    /**
     * Cria um professor
     * @param Professor $professor
     * @return int
     */
    public function adicionar(Professor $professor): int;
    
    /**
     * Lista todos os professores
     * @return Professor[]
     */
    public function listar(): array;
}