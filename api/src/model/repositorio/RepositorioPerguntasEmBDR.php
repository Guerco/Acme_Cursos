<?php

class RepositorioPerguntasEmBDR implements RepositorioPerguntas {
    public function __construct(
        private PDO $pdo
    ){}
    
   public function existeComId(int $id): bool {
        try {
            $sql = <<<'SQL'
                SELECT 1
                FROM pergunta p
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

    /**
     * Summary of buscarCursoEDificuldadePeloID
     * @return null|string[] 
     */
    public function buscarCursoEDificuldadePeloID(int $id): ?array{
        $sql = <<<'SQL'
            SELECT 
                p.dificuldade, c.id as idCurso 
            FROM pergunta p
            JOIN assunto a ON a.id = p.id_assunto
            JOIN curso c ON c.id = a.id_curso
            WHERE 
                p.id = :idPergunta 
        SQL;

        try {
            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'idPergunta' => $id
            ] );
            return $ps->fetch() ?: null;
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível buscar as curso e dificuldade.'); 
        }
    }

    /**
     * @return Pergunta[]
     */
    public function buscarPorAssuntoEAluno(int $idAssunto, int $idAluno): array {
        $sql = <<<'SQL'
            SELECT
                p.id as id_pergunta,
                p.descricao as descricao_pergunta,
                p.caminho_img,
                p.tempo_seg,
                p.dificuldade,
                rp.id as id_resposta,
                rp.descricao as descricao_resposta
            FROM pergunta p
            JOIN resposta_pergunta rp ON p.id = rp.id_pergunta
            LEFT JOIN resposta_aluno ra 
            ON (p.id = ra.id_pergunta and ra.id_aluno = :idAluno)
            WHERE 
                p.id_assunto = :idAssunto
                AND ra.id IS NULL
            ORDER BY
                p.id, rp.id
        SQL;

        try {
            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'idAluno' => $idAluno,
                'idAssunto'=> $idAssunto
            ] );

            $perguntas = [];
            $perguntaId = 0;

            foreach($ps as $d) {
                $perguntaId = $d['id_pergunta'];

                /** @var Dificuldade $dificuldade  */
                $dificuldade = Dificuldade::deString($d['dificuldade']);
                
                $perguntas[(int) $perguntaId] ??= new Pergunta(
                    $perguntaId,
                    null,
                    $d['descricao_pergunta'],
                    $d['caminho_img'],
                    $d['tempo_seg'],
                    $dificuldade
                );

                $perguntas[$perguntaId]->addResposta(
                    new RespostaPergunta(
                        $d['id_resposta'],
                        null,
                        $d['descricao_resposta']
                    )
                );
            }

            return array_values($perguntas);
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível buscar as perguntas.'); 
        }
    }

    /**
     * @return array<int|string>
     */
    function buscarIdsRespostasCorretas(int|string $idPergunta):array{
        try{
            $ps = $this->pdo->prepare(
                'select rp.id from resposta_pergunta rp 
                    where rp.correta = true and rp.id_pergunta = :idPergunta');

            $ps->execute(['idPergunta' => $idPergunta]);

            $respostasCorretas = $ps->fetchAll();
            
            return array_column($respostasCorretas, 'id'); 
        }catch (PDOException $e){
            throw new RepositorioException($e->getMessage());
        }

    }
    
}