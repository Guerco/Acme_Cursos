import { rotasApi } from "../../rotas";
import { ProfessorListagem } from "../dto/ProfessorListagem";
import { RepositorioProfessores } from "./RepositorioProfessores";

const URL_API = rotasApi.professores;

export class RepositorioProfessoresApi implements RepositorioProfessores {
    async buscarTodos(): Promise<ProfessorListagem[]> {
        try {
            const response = await fetch(URL_API);

            if (!response.ok) {
                throw new Error();
            }

            const professores = await response.json();
            return professores.map((p : any) =>
                new ProfessorListagem(
                    p.id,
                    p.nome
                )
            );
        } catch (err) {
            throw new Error('Não foi possível buscar os professores.');
        }
    }
}