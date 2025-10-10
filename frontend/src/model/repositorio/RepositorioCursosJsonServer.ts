import { rotasJsonServer } from "../../rotas";
import { CursoListagem } from "../dto/CursoListagem";
import { RepositorioCursos } from "./RepositorioCursos";

const URL_API = rotasJsonServer.cursos;

export class RepositorioCursosJsonServer implements RepositorioCursos  {
    async buscarTodos() : Promise<CursoListagem[]>{
        try {
            const response = await fetch(URL_API);
        
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
            const cursos = await this.buscarTodos();
            return cursos.filter(c => (
                c.descricao.toLowerCase().includes(filtro.toLowerCase()) || 
                c.nomeProfessor.toLowerCase().includes(filtro.toLowerCase())
            ));  
        } catch(err) {
            throw new Error('Não foi possível buscar os cursos filtrados.');
        }
    }
}