<?php

class RepositorioAdministradoresEmBDR implements RepositorioAdministradores{

    public function __construct(
        private PDO $pdo
    ){}

    public function adicionar(Administrador $administrador): int {
        try{
            $ps = $this->pdo->prepare(
            'insert into administrador (id_credenciais, nome) 
                values (:idCredenciais, :nome)'
            );
            $ps->execute([
                'idCredenciais' => $administrador->getCredenciais()->getId(),
                'nome' => $administrador->getNome()
            ]);
            $idAdministrador = $this->pdo->lastInsertId();

            return $idAdministrador;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        }    
    }

}