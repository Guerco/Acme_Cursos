import { rotasApi } from "../../rotas";
import { Curso } from "../Curso";

const URL_API = rotasApi.cursos;

export class ServicoCurso {
    async buscarTodos() : Promise<Curso[]> {
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

    async buscarFiltrados(filtro : string) : Promise<Curso[]>{
        try {
            // Filtrando localmente
            const cursos = await this.buscarTodos();
            return cursos.filter(c => (
                c.descricao.toLowerCase().includes(filtro.toLowerCase()) || 
                c.professor.nome.toLowerCase().includes(filtro.toLowerCase())
            ));  
        } catch(err) {
            throw new Error('Não foi possível buscar os cursos filtrados.');
        }
    }
}