import { rotasApi } from "../../rotas";
import { ProfessorListagem } from "../dto/ProfessorListagem";
import { RepositorioProfessores } from "./RepositorioProfessores";

const URL_API = rotasApi.professores;

export class RepositorioProfessoresApi implements RepositorioProfessores {
    async buscarTodos(): Promise<ProfessorListagem[]> {
        const response = await fetch(URL_API);

        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    }
}