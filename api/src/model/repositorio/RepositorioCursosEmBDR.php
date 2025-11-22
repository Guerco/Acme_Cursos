<?php

class RepositorioCursosEmBDR implements RepositorioCursos{
    public function __construct( private PDO $pdo){
    }

    public function existeComId(int $id): bool {
        try {
            $sql = <<<'SQL'
                SELECT 1
                FROM curso c
                WHERE
                    c.id = :id
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
    
    /**
     * @return Curso[]
     */
    public function listarCursos(string $nome):array{
        try{
            $ps = $this->pdo->prepare(
                'select c.id, c.descricao, c.caminho_img as caminhoImg, p.id as idProfessor, p.nome, a.id as idAssunto, a.descricao as descricaoAssunto from curso c
                    JOIN assunto a ON (c.id=a.id_curso)
                    JOIN professor p ON (c.id_professor=p.id)
                    WHERE c.descricao LIKE :nomeCurso OR p.nome LIKE :nomeProfessor
                    ORDER BY c.descricao');
            $ps->execute([
                'nomeCurso' => "%$nome%",
                'nomeProfessor' => "%$nome%"
            ]);

            $dados = $ps->fetchAll();

            $cursos = $this->criarCursoEAssuntos($dados);
            
            return $cursos;

        }catch (PDOException $e){
            throw new RepositorioException($e->getMessage());
        }
    }

    /**
     * @param mixed[] $cursos
     * @return Curso[]
     */
    private function criarCursoEAssuntos(array $cursos):array{
        $cursosCriados = [];
        $professor = null;
        $curso = null;
        $assuntos = null;
        $cursoId = 0;

        foreach ($cursos as $c){
            $cursoId = $c['id'];

            if (!isset($cursosCriados[$cursoId])){
                $professor = new Professor();
                $professor->setId($c['idProfessor']);
                $professor->setNome($c['nome']);

                $curso = new Curso($professor);

                $curso->setId($c['id']);
                $curso->setDescricao($c['descricao']);  
                $curso->setCaminhoImg($c['caminhoImg']);
                $curso->setProfessor($professor);
                $curso->setAssuntos([]);

                $cursosCriados[$cursoId] = $curso;
            }
                $assuntos = new Assunto($cursosCriados[$cursoId]);
                $assuntos->setId($c['idAssunto']);
                $assuntos->setDescricao( $c['descricaoAssunto']);
                $cursosCriados[$cursoId]->addAssunto($assuntos);
        }

        return array_values($cursosCriados);
    }

    public function buscarPorIdProfessor(int $idProfessor):array {
        $sql = <<<'SQL'
            SELECT DISTINCT
                c.id,
                c.descricao
            FROM curso c
            JOIN assunto a
            ON c.id = a.id_curso
            WHERE
                c.id_professor = :id_professor
            ORDER BY
                c.descricao;
        SQL;

        try {
            $ps = $this->pdo->prepare($sql);
            $ps->execute(
                ['id_professor' => $idProfessor]
            );

            $cursos = [];

            foreach ($ps as $d) {
                $cursos []= new Curso(
                    null,
                    (int) $d['id'], 
                    $d['descricao']
                );
            }

            return $cursos;
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível buscar os cursos.');
        }
    }

    public function numeroDeAlunosPorCurso(): array{
        try{
            $ps = $this->pdo->prepare(
                'select
                    c.descricao,
                    COUNT(a.id) as quantidade
                from
                    pontuacao p
                join curso c on
                    (c.id = p.id_curso)
                join aluno a on
                    (a.id = p.id_aluno)
                group by
                    c.descricao;');
            $ps->execute();

            $dados = $ps->fetchAll();
            
            return $this->criarNumeroDeAlunosPorCurso($dados);

        }catch (PDOException $e){
            throw new RepositorioException($e->getMessage());
        }
    }

    /**
     * @param array<string|mixed> $dados
     * @return CursoQtdAlunoRelVO[]
     */
    private function criarNumeroDeAlunosPorCurso(array $dados):array {
        $relatorio = [];
        foreach($dados as $d) {
            $cursoQtd = new CursoQtdAlunoRelVO(
                $d['descricao'],
                (int)$d['quantidade']
            );
            $relatorio[] = $cursoQtd;
        }

        return $relatorio;
    }
}

?>