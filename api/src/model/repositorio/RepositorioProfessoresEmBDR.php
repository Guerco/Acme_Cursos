<?php

class RepositorioProfessoresEmBDR implements RepositorioProfessores {

    public function __construct(
        private PDO $pdo
    ) {}

    public function existeComId(int $id): bool {
        try {
            $sql = <<<'SQL'
                SELECT 1
                FROM professor p
                WHERE
                    p.id = :id
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'id' => $id
            ] );

            return (bool) $ps->fetchColumn();
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível verificar o id.'); 
        }
    }

    public function adicionar(Professor $professor): int {
        try {
            $ps = $this->pdo->prepare(
                'insert into professor (id_credenciais, nome) 
                values (:idCredenciais, :nome)'
            );
            $ps->execute([
                'idCredenciais' => $professor->getCredenciais()->getId(),
                'nome' => $professor->getNome()
            ]);
            $idProfessor = $this->pdo->lastInsertId();

            return (int) $idProfessor;
        } catch (PDOException $e) {
            throw new RepositorioException($e->getMessage());
        }
    }

    public function listar(): array {
        $sql = <<<'SQL'
            SELECT
                p.id,
                p.nome
            FROM professor p
            ORDER BY
                p.nome;
        SQL;

        try {
            $ps = $this->pdo->prepare($sql);
            $ps->execute();

            $professores = [];

            foreach ($ps as $d) {
                $professores []= new Professor(
                    (int) $d['id'], 
                    $d['nome']
                );
            }

            return $professores;
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível buscar os professores.');
        }
    }
}
