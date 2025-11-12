import { CursoListagemResumo } from "../dto/CursoListagemResumo";
import { ProfessorListagem } from "../dto/ProfessorListagem";
import { RepositorioProfessores } from "../repositorio/RepositorioProfessores";
import { RepositorioCursos } from "../repositorio/RepositorioCursos";
import { AssuntoListagem } from "../dto/AssuntoListagem";
import { RepositorioAssuntos } from "../repositorio/RepositorioAssuntos";
import { PerguntaCadastro } from "../dto/PerguntaCadastro";
import { RepositorioPerguntas } from "../repositorio/RepositorioPerguntas";
import { DominioException } from "../exception/DominioException";

export class ServicoCadastroPerguntas {
    constructor(
        private repoProfessores: RepositorioProfessores,
        private repoCursos: RepositorioCursos,
        private repoAssuntos: RepositorioAssuntos,
        private repoPerguntas: RepositorioPerguntas
    ) { }

    async buscarProfessores(): Promise<ProfessorListagem[]> {
        return await this.repoProfessores.buscarTodos();
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
            this.validarCadastrarPergunta(pergunta);
            await this.repoPerguntas.enviarPergunta(pergunta);
        } catch (err: any) {
            throw err;
        }
    }

    private validarCadastrarPergunta(pergunta: PerguntaCadastro) {
        const problemas = [];

        if (pergunta.descricao.length < 10) {
            problemas.push( 'O enunciado deve ter no mínimo 10 caracteres.');
        }
        if (pergunta.descricao.length > 255) {
            problemas.push( 'O enunciado deve ter no máximo 255 caracteres.');
        }

        if (!Number.isInteger(pergunta.tempoSeg)) {
            problemas.push( 'O tempo em segundos deve ser um número inteiro.');
        }
        if (pergunta.tempoSeg < 30) {
            problemas.push( 'O tempo em segundos deve ser no mínimo 30.');
        }
        if (pergunta.tempoSeg > 180) {
            problemas.push( 'O tempo em segundos deve ser no máximo 180.');
        }

        for (const resposta of pergunta.respostas) {
            if (resposta.descricao.length < 1) {
                problemas.push( 'As respostas devem ter no mínimo 1 caractere.');
            }
            if (resposta.descricao.length > 200) {
                problemas.push( 'As respostas devem ter no máximo 200 caracteres.');
            }
        }

        if (problemas.length > 0) throw DominioException.comProblemas(problemas);
    }



}