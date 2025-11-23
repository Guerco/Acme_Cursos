import { rotasApi } from "../../rotas";
import { CursoListagem } from "../dto/CursoListagem";
import { RepositorioCursos } from "../repositorio/RepositorioCursos";
import { CursoQtdAlunoRel } from "../dto/relatorio/CursoQtdAlunoRel";

const URL_API = rotasApi.cursos;

export class ServicoCurso {
    private qtdAlunosCurso?: CursoQtdAlunoRel[];
    constructor(private repositorio : RepositorioCursos){}

    async buscarTodos() : Promise<CursoListagem[]> {
        try {
            return await this.repositorio.buscarTodos();
        } catch(err : any) {
            throw new Error(err.message);
        }
    }

    async buscarFiltrados(filtro : string) : Promise<CursoListagem[]>{
        try {
            return await this.repositorio.buscarPorDescricaoOuProfessor(filtro);  
        } catch(err: any) {
            throw new Error(err.message);
        }
    }

     async buscarNumeroDeAlunosPorCurso() : Promise<CursoQtdAlunoRel[]> {
        try{
            return this.qtdAlunosCurso ??= await this.repositorio.buscarNumeroDeAlunosPorCurso();
        }catch(err: any) {
            throw new Error(err.message);
        }
    }
}