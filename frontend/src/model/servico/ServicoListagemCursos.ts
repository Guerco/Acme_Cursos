import { rotasApi } from "../../rotas";
import { CursoListagem } from "../dto/CursoListagem";
import { RepositorioCursos } from "../repositorio/RepositorioCursos";

const URL_API = rotasApi.cursos;

export class ServicoCurso {
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
}