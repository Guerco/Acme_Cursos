<?php

interface Autentificacao {
    public function entrar(Credenciais $credenciais): UsuarioSessaoDTO;
    public function sair(): void;
    public function estaLogado(): bool;
}