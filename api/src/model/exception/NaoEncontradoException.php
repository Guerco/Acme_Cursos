<?php

class NaoEncontradoException extends DominioException{
    
    public static function comProblemas( array $problemas ): DominioException {
        return new Self(
            implode( SEPARADOR_MENSAGENS, $problemas )
        );
    }
}