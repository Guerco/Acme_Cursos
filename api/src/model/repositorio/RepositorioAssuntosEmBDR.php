<?php

class RepositorioAssuntosEmBDR implements RepositorioAssuntos
{
    public function __construct(private PDO $pdo)
    {
    }

    public function existeComId(int $id): bool
    {
        try {
            $sql = <<<'SQL'
                SELECT 1
                FROM assunto a
                WHERE
                    a.id = :id
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute([
                'id' => $id
            ]);

            return (bool) $ps->fetchColumn();
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível verificar o id.');
        }
    }

    public function buscarPeloId(int $id): bool|Assunto {
        try {
            $sql = <<<'SQL'
                SELECT
                    id_curso,
                    descricao
                FROM assunto a
                WHERE
                    a.id = :id
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute([
                'id' => $id
            ]);

            $result = $ps->fetch();
            if ($result === false) return false; 
            return new Assunto(
                new Curso(
                    null,
                    (int) $result['id_curso'], 
                ),
                (int) $id,
                $result['descricao']
            );
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível buscar pelo id.');
        }
    }

    public function buscarIdProfessor(int $id): bool|int {
        try {
            $sql = <<<'SQL'
                SELECT
                    c.id_professor
                FROM assunto a
                JOIN curso c ON c.id = a.id_curso
                WHERE
                    a.id = :id
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute([
                'id' => $id
            ]);

            $result = $ps->fetchColumn();
            if ($result === false) return false; 
            return (int) $result;
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível buscar o professor do assunto.');
        }
    }

    public function buscarPorIdCurso(int $idCurso): array
    {
        $sql = <<<'SQL'
            SELECT DISTINCT
                a.id,
                a.descricao
            FROM assunto a
            WHERE
                a.id_curso = :id_curso
            ORDER BY
                a.descricao;
        SQL;

        try {
            $ps = $this->pdo->prepare($sql);
            $ps->execute(
                ['id_curso' => $idCurso]
            );

            $assuntos = [];

            foreach ($ps as $d) {
                $assuntos[] = new Assunto(
                    null,
                    (int) $d['id'],
                    $d['descricao']
                );
            }

            return $assuntos;
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível buscar os assuntos.');
        }
    }
}

?>