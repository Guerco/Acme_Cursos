<?php

class GerenciadorDeSenha {
    private string $pimentaInicio;
    private string $pimentaFim;

    public function __construct() {
        $this->pimentaInicio = $_ENV['QUIZ_PEPER_INICIO'] ?? null;
        $this->pimentaFim    = $_ENV['QUIZ_PEPER_FIM'] ?? null;

        if ($this->pimentaInicio === null || $this->pimentaFim === null) {
            throw new ServidorException("Variáveis de ambiente 'QUIZ_PEPER_INICIO' e 'QUIZ_PEPER_FIM' não configuradas.");
        }
    }

    /**
     * @return array{
     *     senha: string,
     *     sal: string
     * }
     */
    public function criarHash(string $senha): array {
        $sal = $this->gerarSal();
        $senhaApimentada = $this->pimentaInicio . $sal . $senha . $this->pimentaFim;
        $hashSenha = hash('sha512', $senhaApimentada);

        return ['senha' => $hashSenha, 'sal' => $sal];
    }

    public function verificarSenha(string $senha, string $sal, string $hashBanco): bool {
        $senhaMontada = $this->pimentaInicio . $sal . $senha . $this->pimentaFim;
        $hashCalculado = hash('sha512', $senhaMontada);

        return hash_equals($hashBanco, $hashCalculado);
    }

    private function gerarSal(): string {
        return bin2hex(random_bytes(16));
    }
}