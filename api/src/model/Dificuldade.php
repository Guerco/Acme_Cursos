<?php

enum Dificuldade: string{
    case FACIL = 'Fácil';
    case MEDIO = 'Médio';
    case DIFICIL = 'Difícil';

    public static function deString(string $valor){
        return match ($valor) {
            'facil' => self::FACIL,
            'medio' => self::MEDIO,
            'dificil' => self::DIFICIL,
            default => null,
        };
    }
}