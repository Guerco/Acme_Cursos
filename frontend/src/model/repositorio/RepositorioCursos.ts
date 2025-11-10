import { CursoListagem } from "../dto/CursoListagem";
import { CursoListagemResumo } from "../dto/CursoListagemResumo";

export interface RepositorioCursos {
    buscarTodos() : Promise<CursoListagem[]>;
    buscarPorDescricaoOuProfessor(filtro : string) : Promise<CursoListagem[]>;
    buscarResumidoPorIdProfessor(idProfessor : number) : Promise<CursoListagemResumo[]>;
}

