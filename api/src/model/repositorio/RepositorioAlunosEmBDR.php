<?php

class RepositorioAlunosEmBDR implements RepositorioAlunos{

    public function __construct(
        private PDO $pdo
    ){}

    public function existeComCredenciais(Credenciais $credenciais): int {
        try {
            $sql = <<<'SQL'
                SELECT u.id
                FROM credenciais  u
                INNER JOIN aluno a ON u.id = a.id_usuario
                WHERE
                    u.email = :email
                    AND u.senha = :senha
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'email' => $credenciais->getEmail(),
                'senha'=> $credenciais->getSenha()
            ] );

            return (int) $ps->fetchColumn();
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível verificar as credenciais.'); 
        }
    }
}