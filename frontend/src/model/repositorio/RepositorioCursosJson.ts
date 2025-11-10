import { rotasJsonServer } from "../../rotas";
import { CursoListagem } from "../dto/CursoListagem";
import { CursoListagemResumo } from "../dto/CursoListagemResumo";
import { RepositorioCursos } from "./RepositorioCursos";

const URL_API = rotasJsonServer.cursos;

export class RepositorioCursosJson implements RepositorioCursos {
    async buscarTodos(): Promise<CursoListagem[]> {
        return [] as CursoListagem[];
    }

    async buscarPorDescricaoOuProfessor(filtro: string): Promise<CursoListagem[]> {
        return [] as CursoListagem[];
    }

    async buscarResumidoPorIdProfessor(idProfessor: number): Promise<CursoListagemResumo[]> {
        const cursosResumido = [
            { "id": 1, "idProfessor": 1, "descricao": "Microsoft Excel Intermediário" },
            { "id": 2, "idProfessor": 1, "descricao": "Matemática Básica" },
            { "id": 3, "idProfessor": 2, "descricao": "Modelagem de dados" },
            // { "id": 4, "idProfessor": 2, "descricao": "Modelando dados no Power BI" },
            { "id": 5, "idProfessor": 3, "descricao": "Geografia" },
            { "id": 6, "idProfessor": 4, "descricao": "Fundamentos de TI: Hardware e Software" }
        ];

        return cursosResumido
            .filter(c => c.idProfessor === idProfessor)
            .map(c => ({
                id: c.id,
                descricao: c.descricao
            }));
    }
}