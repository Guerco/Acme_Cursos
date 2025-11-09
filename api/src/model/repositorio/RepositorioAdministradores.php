<?php

interface RepositorioAdministradores{
    /**
     * Cria um administrador
     * @param Administrador $administrador
     * @return int
     */
    public function adicionar(Administrador $administrador): int;
}