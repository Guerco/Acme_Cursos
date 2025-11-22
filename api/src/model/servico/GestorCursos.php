<?php

class GestorCursos{
        
    public function __construct(
        private RepositorioCursos $repoCursos,
        private RepositorioAssuntos $repoAssuntos
    ) { }

    /**
     * @return CursoListagemDTO[]
     */
    public function listarCursos(string $nome): array{
        $cursos = [];
        $resultado = [];

        $cursos = $this->repoCursos->listarCursos($nome);
        $resultado = CursoListagemDTO::deObjetosParaDTO($cursos);

        return $resultado;
    }

    /**
     * @return AssuntoListagemDTO[]
     */
    public function buscarAssuntosCurso(string|int $idCurso): array{
        $this->validarBuscarAssuntosCurso($idCurso);

        $assuntos = [];
        $assuntos = $this->repoAssuntos->buscarPorIdCurso((int) $idCurso);
        
        return AssuntoListagemDTO::deObjetos($assuntos);
    }

    private function validarBuscarAssuntosCurso(string|int|null $idCurso): void{
        $idCurso = $idCurso ?: null;

        if ($idCurso === null) {
            throw new DominioException('Informe curso.'); 
        } else if (
            !filter_var($idCurso, FILTER_VALIDATE_INT) 
        ) {
            throw new DominioException('Os ids devem ser inteiros.');     
        }
        
        if (! $this->repoCursos->existeComId((int) $idCurso)){
            throw new DominioException('Curso inexistente.');
        }
    }

    /**
     * @return CursoQtdAlunoRelDTO[]
     */
    public function listarNumeroDeAlunosPorCurso(): array{
        $dados = [];
        $resultado = [];

        $dados = $this->repoCursos->numeroDeAlunosPorCurso();
        $resultado = CursoQtdAlunoRelDTO::deVOS($dados);

        return $resultado;
    }


}