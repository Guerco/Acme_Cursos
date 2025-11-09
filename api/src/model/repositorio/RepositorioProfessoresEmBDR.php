<?php

class RepositorioProfessoresEmBDR implements RepositorioProfessores{

    public function __construct(
        private PDO $pdo
    ){}

    public function adicionar(Professor $professor): int{
        try{
            $ps = $this->pdo->prepare(
            'insert into professor (id_credenciais, nome) 
                values (:idCredenciais, :nome)'
            );
            $ps->execute([
                'idCredenciais' => $professor->getCredenciais()->getId(),
                'nome' => $professor->getNome()
            ]);
            $idProfessor = $this->pdo->lastInsertId();

            return $idProfessor;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        } 
    }

}