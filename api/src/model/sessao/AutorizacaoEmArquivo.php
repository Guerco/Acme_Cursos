<?php

class AutorizacaoEmArquivo implements Autorizacao {
    /**
     * Summary of verificarAutorizacao
     * @param string[] $usuariosAutorizados
     * @return bool
     */
    public function verificarAutorizacao(array $usuariosAutorizados) : bool{
        
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_name('sid');
            session_start();
        }
        
        if (!isset($_SESSION['tipo_usuario'])) {
            return false;
        }
        
        $tipo = $_SESSION['tipo_usuario'];

        return in_array($tipo, $usuariosAutorizados );
    }
}