import { rotasApi, rotasJsonServer } from "../../rotas";
import { CursoListagem } from "../dto/CursoListagem";
import { RepositorioCursos } from "./RepositorioCursos";


export class RepositorioCursosApi implements RepositorioCursos  {
    async buscarTodos() : Promise<CursoListagem[]>{
        try {
            const response = await fetch(rotasApi.cursos);
        
            if (!response.ok){
                throw new Error();
            }
            const cursos = await response.json();
            return cursos;
        } catch(err) {
            throw new Error('Não foi possível buscar os cursos.');
        }
    }
    
    async buscarPorDescricaoOuProfessor(filtro : string) : Promise<CursoListagem[]>{
        try {
            const response = await fetch(rotasApi.cusosBusca+filtro);

            if (!response.ok){
                throw new Error();
            }

            const cursos = await response.json();
            return cursos;
        } catch(err) {
            throw new Error('Não foi possível buscar os cursos filtrados.');
        }
    }
}