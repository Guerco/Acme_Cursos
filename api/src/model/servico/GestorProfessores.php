<?php

class GestorProfessores{
        
    public function __construct(
        private RepositorioProfessores $repoProfessores,
        private RepositorioCursos $repoCursos,
        private Autentificacao $autentificacao,
        private Autorizacao $autorizacao,
    ) { }

    /**
     * @param TipoUsuario[] $autorizados
     * @throws NaoAutorizadoException
     */
    private function autorizar (array $autorizados): void {
        $usuariosAutorizados = array_map(
            fn(TipoUsuario $tipo) => $tipo->value,
            $autorizados
        );

        $estaAutorizado = (
            $this->autentificacao->estaLogado() &&
            $this->autorizacao->verificarAutorizacao($usuariosAutorizados)
        );

        if (! $estaAutorizado) throw new NaoAutorizadoException('Não possui acesso a este recurso.');
    }

    /**
     * @return ProfessorListagemDTO[]
     */
    public function listarProfessoresResumido(): array{
        $this->autorizar(
            [
                TipoUsuario::PROFESSOR,
                TipoUsuario::ADMINISTRADOR,
                TipoUsuario::PROFESSOR_ADMINISTRADOR,
            ]
        );
        $professores = [];
        $professores = $this->repoProfessores->listar();

        return ProfessorListagemDTO::deObjetos($professores);
    }

    /**
     * @return CursoListagemResumoDTO[]
     */
    public function buscarCursosProfessor(string|int $idProfessor): array{
        $this->autorizar(
            [
                TipoUsuario::PROFESSOR,
                TipoUsuario::ADMINISTRADOR,
                TipoUsuario::PROFESSOR_ADMINISTRADOR,
            ]
        );
        
        if ( 
            $this->autentificacao->estaLogado() 
            && $this->autentificacao->buscarTipoUsuario() === TipoUsuario::PROFESSOR->value
        ) {
            $idProfessor = $this->autentificacao->buscaridUsuario();
        } 
        
        $this->validarBuscarCursosProfessor($idProfessor);

        $cursos = [];
        $cursos = $this->repoCursos->buscarPorIdProfessor((int) $idProfessor);
        
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