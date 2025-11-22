import { rotasApi } from "../../rotas";
import { ProfessorListagem } from "../dto/ProfessorListagem";
import { NaoAutorizadoException } from "../exception/NaoAutorizadoException";
import { RepositorioProfessores } from "./RepositorioProfessores";

const URL_API = rotasApi.professores;

export class RepositorioProfessoresApi implements RepositorioProfessores {
    async buscarTodos(): Promise<ProfessorListagem[]> {
        try {
            const response = await fetch(URL_API, 
                {
                    credentials: 'include',
                });

            if (!response.ok) {
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
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
            if (err instanceof NaoAutorizadoException) throw err;
            throw new Error('Não foi possível buscar os professores.');
        }
    }
}