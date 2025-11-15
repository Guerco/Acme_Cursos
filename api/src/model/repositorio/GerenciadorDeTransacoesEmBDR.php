<?php

class GerenciadorDeTransacoesEmBDR implements GerenciadorDeTransacoes
{
    private ?PDO $pdo = null;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function iniciar(): void {
        if (!$this->pdo) {
            throw new RuntimeException('Erro ao iniciar transação.');
        }
        $this->pdo->beginTransaction();
    }

    public function confirmar(): void {
        if (!$this->pdo) {
            throw new RuntimeException('Erro ao confirmar transação.');
        }
        $this->pdo->commit();
    }

    public function reverter(): void {
        if (!$this->pdo) {
            throw new RuntimeException('Erro ao reverter transação.');
        }
        $this->pdo->rollBack();
    }

    public function obterConexao(): PDO {
        if (!$this->pdo) {
            throw new RuntimeException('Erro ao obter conexão.');
        }
        return $this->pdo;
    }
}
