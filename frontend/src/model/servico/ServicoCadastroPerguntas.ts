import { CursoListagemResumo } from "../dto/CursoListagemResumo";
import { ProfessorListagem } from "../dto/ProfessorListagem";
import { RepositorioProfessores } from "../repositorio/RepositorioProfessores";
import { RepositorioCursos } from "../repositorio/RepositorioCursos";
import { AssuntoListagem } from "../dto/AssuntoListagem";
import { RepositorioAssuntos } from "../repositorio/RepositorioAssuntos";
import { PerguntaCadastro } from "../dto/PerguntaCadastro";
import { RepositorioPerguntas } from "../repositorio/RepositorioPerguntas";

export class ServicoCadastroPerguntas {
    constructor(
        private repoProfessores: RepositorioProfessores,
        private repoCursos: RepositorioCursos,
        private repoAssuntos: RepositorioAssuntos,
        private repoPerguntas: RepositorioPerguntas
    ) { }

    async buscarProfessores(): Promise<ProfessorListagem[]> {
        try {
            return await this.repoProfessores.buscarTodos();
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async buscarCursosProfessor(idProfessor: number): Promise<CursoListagemResumo[]> {
        try {
            return await this.repoCursos.buscarResumidoPorIdProfessor(idProfessor);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async buscarAssuntosCurso(idCurso: number): Promise<AssuntoListagem[]> {
        try {
            return await this.repoAssuntos.buscarPorIdCurso(idCurso);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async cadastrarPergunta(pergunta: PerguntaCadastro) {
        try {
            const erro = this.validarCadastrarPergunta(pergunta);
            if (erro != '') {
                throw new Error(erro);
            }
            await this.repoPerguntas.cadastrarPergunta(pergunta);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    private validarCadastrarPergunta(pergunta: PerguntaCadastro): string {
        if (pergunta.descricao.length < 10) {
            return 'O enunciado deve ter no mínimo 10 caracteres.';
        }
        if (pergunta.descricao.length > 255) {
            return 'DesO enunciadocrição deve ter no máximo 255 caracteres.';
        }

        for (const resposta of pergunta.respostas) {
            if (resposta.descricao.length < 10) {
                return 'As respostas devem ter no mínimo 10 caracteres.';
            }
            if (resposta.descricao.length > 200) {
                return 'As respostas devem ter no máximo 200 caracteres.';
            }
        }

        return '';
    }



}