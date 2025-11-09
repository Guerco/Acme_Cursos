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
                INNER JOIN aluno a ON u.id = a.id_credenciais
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

            /** @var Aluno $aluno */
            $aluno = $respostaAluno->getAluno();

            /** @var Pergunta $pergunta */
            $pergunta = $respostaAluno->getPergunta();

            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'id_aluno' => $aluno->getId(),
                'id_pergunta' => $pergunta->getId(),
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

    public function buscarPontuacaoPorCurso($idAluno, $idCurso): float|bool {
        try {
            $sql = <<<'SQL'
                SELECT p.pontuacao
                FROM pontuacao p
                WHERE
                    p.id_aluno = :id_aluno
                    AND p.id_curso = :id_curso
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'id_aluno' => $idAluno,
                'id_curso'=> $idCurso
            ] );

            $pontuacao = $ps->fetchColumn();

            return ($pontuacao === false) ? false : (float) $pontuacao;
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível buscar a pontuação.'); 
        }
    }

    public function incrementarPontuacaoGeral(int $idAluno, float $valor) : void{
        try {
            $sql = <<<'SQL'
                UPDATE aluno a
                SET a.pontuacao_geral = a.pontuacao_geral + :valor
                where a.id = :idAluno;
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'idAluno' => $idAluno,
                'valor' => $valor
            ] );
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível incrementar a pontuação geral do aluno.'); 
        }    
    }

    public function incrementarPontuacaoCurso(int $idAluno, int $idCurso, float $valor) : void{
        try {
            $sql = <<<'SQL'
                INSERT INTO pontuacao (id_aluno, id_curso, pontuacao)
                VALUES (:idAluno, :idCurso, :valor)
                ON DUPLICATE KEY UPDATE
                pontuacao = pontuacao + :valor;
            SQL;

            $ps = $this->pdo->prepare($sql);
            $ps->execute( [
                'idAluno' => $idAluno,
                'idCurso' => $idCurso,
                'valor' => $valor
            ] );
        } catch (PDOException $e) {
            throw new RepositorioException('Não foi possível incrementar a pontuação geral do aluno.'); 
        }    
    }

    public function adicionar(Aluno $aluno): int {
        try{
            $ps = $this->pdo->prepare(
            'insert into aluno (id_credenciais, nome) 
                values (:idCredenciais, :nome)'
            );
            $ps->execute([
                'idCredenciais' => $aluno->getCredenciais()->getId(),
                'nome' => $aluno->getNome()
            ]);
            $idAluno = $this->pdo->lastInsertId();

            return $idAluno;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        }    
    }
}