<?php

class RepositorioRespostasPerguntaEmBDR implements RepositorioRespostasPergunta
{
    public function __construct(
        private PDO $pdo
    ) {
    }

    public function cadastrarResposta(RespostaPergunta $respostaPergunta): void
    {
        try {
            $sql = <<<'SQL'
                INSERT INTO 
                    resposta_pergunta(id_pergunta, descricao, correta)
                VALUES 
                    (:id_pergunta, :descricao, :correta)
            SQL;

            /** @var Pergunta $pergunta */
            $pergunta = $respostaPergunta->getPergunta();
            
            $ps = $this->pdo->prepare($sql);
            $ps->execute([
                'id_pergunta' => $pergunta->getId(),
                'descricao' => $respostaPergunta->getDescricao(),
                'correta' => $respostaPergunta->isCorreta()
            ]);
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível cadastrar a resposta da pergunta.');
        }
    }
}