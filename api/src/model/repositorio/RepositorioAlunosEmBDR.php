<?php

class RepositorioAlunosEmBDR implements RepositorioAlunos{

    public function __construct(
        private PDO $pdo
    ){}

    public function existeComId(int $id): bool {
        try {
            $sql = <<<'SQL'
                SELECT 1
                FROM aluno a
                WHERE
                    a.id = :id
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
    
    public function existeComCredenciais(Credenciais $credenciais): Aluno|bool {
        try {
            $sql = <<<'SQL'
                SELECT 
                    a.id, 
                    a.nome, 
                    a.pontuacao_geral
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

            $dados = $ps->fetch();
            if (! $dados)
                return false;
            
            return new Aluno(
                (int) $dados['id'],
                $dados['nome'],
                (float) $dados['pontuacao_geral']
            );
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível verificar as credenciais.'); 
        }
    }

    public function cadastrarResposta(RespostaAluno $respostaAluno): void{
        try {
            $sql = <<<'SQL'
                INSERT INTO resposta_aluno(id_aluno, id_pergunta, resposta_correta)
                VALUES (:id_aluno, :id_pergunta, :resposta_correta)
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'id_aluno' => $respostaAluno->getAluno()->getId(),
                'id_pergunta' => $respostaAluno->getPergunta()->getId(),
                'resposta_correta' => $respostaAluno->isRespostaCorreta()
            ] );
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível cadastrar a resposta do aluno.'); 
        }
    }

    public function existeResposta(int $idAluno, int $idPergunta): int{
        try {
            $sql = <<<'SQL'
                SELECT 1 FROM resposta_aluno ra
                WHERE ra.id_aluno = :idAluno and ra.id_pergunta = :idPergunta
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'idAluno' => $idAluno,
                'idPergunta' => $idPergunta
            ] );
            return (int) $ps->fetchColumn();
        } catch (PDOException $e) {
            throw new PDOException('Não foi possível verificar a resposta.'.$e->getMessage()); 
        }
    }
}