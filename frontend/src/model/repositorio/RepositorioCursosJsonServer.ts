import { rotasJsonServer } from "../../rotas";
import { CursoListagem } from "../dto/CursoListagem";
import { CursoListagemResumo } from "../dto/CursoListagemResumo";
import { RepositorioCursos } from "./RepositorioCursos";

const URL_API = rotasJsonServer.cursos;

export class RepositorioCursosJsonServer implements RepositorioCursos {
    async buscarTodos(): Promise<CursoListagem[]> {
        try {
            const response = await fetch(URL_API);

            if (!response.ok) {
                throw new Error();
            }
            let cursos = await response.json();
            cursos = this.ordenarCursos(cursos);
            return cursos;
        } catch (err) {
            throw new Error('Não foi possível buscar os cursos.');
        }
    }

    async buscarPorDescricaoOuProfessor(filtro: string): Promise<CursoListagem[]> {
        try {
            let cursos = await this.buscarTodos();
            cursos = this.ordenarCursos(cursos);
            return cursos.filter(c => (
                c.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
                c.nomeProfessor.toLowerCase().includes(filtro.toLowerCase())
            ));
        } catch (err) {
            throw new Error('Não foi possível buscar os cursos filtrados.');
        }
    }

    private ordenarCursos(cursos: CursoListagem[]) {
        return cursos.sort((c1: CursoListagem, c2: CursoListagem) => {
            return (c1.descricao > c2.descricao) ? 1 : -1;
        });
    }

    async buscarResumidoPorIdProfessor(idProfessor: number): Promise<CursoListagemResumo[]> {
        return [] as CursoListagemResumo[];
    }
}