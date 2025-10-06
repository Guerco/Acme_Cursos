import { rotasApi } from "../../rotas";
import { Curso } from "../Curso";
import { RepositorioCursos } from "../repositorio/RepositorioCursos";

const URL_API = rotasApi.cursos;

export class ServicoCurso {
    constructor(private repositorio : RepositorioCursos){}

    async buscarTodos() : Promise<Curso[]> {
        try {
            return await this.repositorio.buscarTodos();
        } catch(err : any) {
            throw new Error(err.message);
        }
    }

    async buscarFiltrados(filtro : string) : Promise<Curso[]>{
        try {
            return await this.repositorio.buscarPorDescricaoOuProfessor(filtro);  
        } catch(err: any) {
            throw new Error(err.message);
        }
    }
}