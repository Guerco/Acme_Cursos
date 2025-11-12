<?php

enum Dificuldade: string{
    case FACIL = 'Fácil';
    case MEDIO = 'Médio';
    case DIFICIL = 'Difícil';

    public static function deString(string $valor): Dificuldade|null{
        return match ($valor) {
            'facil' => self::FACIL,
            'medio' => self::MEDIO,
            'dificil' => self::DIFICIL,
            default => null,
        };
    }

    public function getValor(): float {
        return match($this) {
            self::FACIL => 1.0,
            self::MEDIO => 1.5,
            self::DIFICIL => 2.0,
        };
    }

    public function paraString(): string {
        return match($this) {
            self::FACIL => 'facil',
            self::MEDIO => 'medio',
            self::DIFICIL => 'dificil5',
        };
    }
}