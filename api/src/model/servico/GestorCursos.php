<?php

class GestorCursos{
        
    public function __construct(private RepositorioCursos $repositorio){
    }

    public function listarCursos(string $nome): array{
        $cursos = [];
        $resultado = [];

        $cursos = $this->repositorio->listarCursos($nome);
        $resultado = CursoListagemDTO::deObjetosParaDTO($cursos);

        return $resultado;
    }

      

}