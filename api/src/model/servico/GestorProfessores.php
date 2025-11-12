<?php

class GestorProfessores{
        
    public function __construct(
        private RepositorioProfessores $repoProfessores,
        private RepositorioCursos $repoCursos
    ) { }

    /**
     * @return ProfessorListagemDTO[]
     */
    public function listarProfessoresResumido(): array{
        $professores = [];
        $professores = $this->repoProfessores->listar();

        return ProfessorListagemDTO::deObjetos($professores);
    }

    /**
     * @return CursoListagemResumoDTO[]
     */
    public function buscarCursosProfessor(string|int $idProfessor): array{
        $this->validarBuscarCursosProfessor($idProfessor);

        $cursos = [];
        $cursos = $this->repoCursos->buscarPorIdProfessor($idProfessor);
        
        return CursoListagemResumoDTO::deObjetos($cursos);
    }

    private function validarBuscarCursosProfessor(string|int|null $idProfessor): void{
        $idProfessor = $idProfessor ?: null;

        if ($idProfessor === null) {
            throw new DominioException('Informe professor.'); 
        } else if (
            !filter_var($idProfessor, FILTER_VALIDATE_INT) 
        ) {
            throw new DominioException('Os ids devem ser inteiros.');     
        }
        
        if (! $this->repoProfessores->existeComId((int) $idProfessor)){
            throw new DominioException('Professor inexistente.');
        }
    }
}