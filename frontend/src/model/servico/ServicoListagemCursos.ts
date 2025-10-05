import { rotasApi } from "../../rotas";
import { Curso } from "../Curso";

const URL_API = rotasApi.cursos;

export class ServicoCurso {
    async buscarTodos() : Promise<Curso[]> {
        const response = await fetch(URL_API);
        
        if (!response.ok){
            throw new Error('Erro ao buscar os cursos.');
        }
        const cursos = await response.json();
        return cursos;
    }
}