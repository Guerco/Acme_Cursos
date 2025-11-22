import { CursoListagem } from "../dto/CursoListagem";
import { CursoListagemResumo } from "../dto/CursoListagemResumo";
import { CursoQtdAlunoRel } from "../dto/relatorio/CursoQtdAlunoRel";

export interface RepositorioCursos {
    buscarTodos() : Promise<CursoListagem[]>;
    buscarPorDescricaoOuProfessor(filtro : string) : Promise<CursoListagem[]>;
    buscarResumidoPorIdProfessor(idProfessor : number) : Promise<CursoListagemResumo[]>;
    buscarNumeroDeAlunosPorCurso() : Promise<CursoQtdAlunoRel[]>;
}

