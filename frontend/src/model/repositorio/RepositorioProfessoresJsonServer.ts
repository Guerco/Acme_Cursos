import { rotasJsonServer } from "../../rotas";
import { ProfessorListagem } from "../dto/ProfessorListagem";
import { RepositorioProfessores } from "./RepositorioProfessores";

const URL_API = rotasJsonServer.professores;

export class RepositorioProfessoresJsonServer implements RepositorioProfessores {
    async buscarTodos() : Promise<ProfessorListagem[]>{
            try {
                const response = await fetch(URL_API);
            
                if (!response.ok){
                    throw new Error();
                }
                return await response.json();
            } catch(err) {
                throw new Error('Não foi possível buscar os professores.');
            }
        }
}