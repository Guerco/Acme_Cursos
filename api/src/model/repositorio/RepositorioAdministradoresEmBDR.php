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

            /**
             * @var Credenciais
             */
            $credenciais = $administrador->getCredenciais();

            $ps->execute([
                'idCredenciais' => $credenciais->getId(),
                'nome' => $administrador->getNome()
            ]);
            $idAdministrador = $this->pdo->lastInsertId();

            return (int) $idAdministrador;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        }    
    }

}