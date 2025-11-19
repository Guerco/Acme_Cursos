<?php

interface Autorizacao {

    /**
     * @param string[] $usuariosAutorizados
     * 
     * @return bool
     */
    public function verificarAutorizacao(array $usuariosAutorizados) : bool;
}