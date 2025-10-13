<?php

class RepositorioCursosEmBDR implements RepositorioCursos{
    private $cursos = [];

    public function __construct( private ?PDO $pdo){
    }

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

    private function criarCursoEAssuntos($cursos):array{
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

        return $cursosCriados;
    }

}

?>