<?php

class GestorAlunos {
    public function __construct(
        private RepositorioAlunos $repositorioAlunos
    ){}

    public function verificarCredenciais(array $dados) : int {
        if (! $dados['email'] || ! $dados['senha']) {
            throw new DominioException('Email e senhaa devem ser informados.'); 
        }

        $credenciais = new Credenciais(null, $dados['email'], $dados['senha']);

        $problemas = $credenciais->validar();
        if (!empty($problemas)){
            throw DominioException::comProblemas($problemas);
        }

        $id = $this->repositorioAlunos->existeComCredenciais($credenciais);

        if(!$id){
            throw new NaoEncontradoException('Credenciais inválidas.'); 
        } else return $id;
    }
}