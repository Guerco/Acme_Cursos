<?php

interface Autenticacao {
    public function entrar(Credenciais $credenciais): UsuarioSessaoDTO;
    public function sair(): void;
    public function estaLogado(): bool;
    public function buscaridUsuario() : int;
    public function buscarTipoUsuario() : string;
}