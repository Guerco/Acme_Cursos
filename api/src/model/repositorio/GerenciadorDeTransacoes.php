<?php

interface GerenciadorDeTransacoes
{    
    public function iniciar(): void ;

    public function confirmar(): void ;

    public function reverter(): void ;
}
