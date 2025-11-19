<?php

class AutorizacaoEmArquivo implements Autorizacao {
    public function verificarAutorizacao(array $usuariosAutorizados) : bool{
        if (!isset($_SESSION['tipo_usuario'])) {
            return false;
        }
        
        $tipo = $_SESSION['tipo_usuario'];

        return in_array($tipo, $usuariosAutorizados );
    }
}