<?php

class RepositorioException extends RuntimeException {

    /**
     * @param string[] $problemas
     */
    public static function comProblemas( array $problemas ): DominioException {
        return new DominioException(
            implode( SEPARADOR_MENSAGENS, $problemas )
        );
    }

    /**
     * Retorna a mensagem como problemas.
     * @return string[]
     */
    public function getProblemas(): array {
        return explode( SEPARADOR_MENSAGENS, $this->getMessage() );
    }
}

?>