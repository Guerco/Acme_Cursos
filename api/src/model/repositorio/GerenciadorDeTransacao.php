<?php

class GerenciadorDeTransacao
{
    private static ?PDO $pdo = null;

    public static function definirConexao(PDO $pdo): void {
        self::$pdo = $pdo;
    }

    public static function iniciar(): void {
        if (!self::$pdo) {
            throw new DominioException('Erro ao iniciar transação.');
        }
        self::$pdo->beginTransaction();
    }

    public static function confirmar(): void {
        if (!self::$pdo) {
            throw new DominioException('Erro ao confirmar transação.');
        }
        self::$pdo->commit();
    }

    public static function reverter(): void {
        if (!self::$pdo) {
            throw new DominioException('Erro ao reverter transação.');
        }
        self::$pdo->rollBack();
    }

    public static function obterConexao(): PDO {
        if (!self::$pdo) {
            throw new DominioException('Erro ao obter conexão.');
        }
        return self::$pdo;
    }
}
