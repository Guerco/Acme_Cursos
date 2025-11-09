<?php

interface RepositorioProfessores{
    /**
     * Cria um professor
     * @param Professor $professor
     * @return int
     */
    public function adicionar(Professor $professor): int;
}