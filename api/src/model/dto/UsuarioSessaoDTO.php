<?php

class UsuarioSessaoDTO {
    public function __construct(
        public string $nome,
        public string $tipoUsuario
    ) {}
}