import { CursoListagem } from "../dto/CursoListagem";

export interface RepositorioCursos {
    buscarTodos() : Promise<CursoListagem[]>;
    buscarPorDescricaoOuProfessor(filtro : string) : Promise<CursoListagem[]>;
}

