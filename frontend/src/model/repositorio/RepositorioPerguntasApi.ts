import { RepositorioPerguntas } from "./RepositorioPerguntas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { rotasApi } from "../../rotas";
import { PerguntaCadastro } from "../dto/PerguntaCadastro";
import { DominioException } from "../exception/DominioException";

export class RepositorioPerguntasApi implements RepositorioPerguntas {

    async buscarPerguntas(idAluno: number, idAssunto: number): Promise<PerguntaListagem[]> {
        try {
            const response = await fetch(rotasApi.buscarPerguntas(idAluno, idAssunto));

            if (!response.ok) {
                throw new Error();
            }

            const perguntas = await response.json();
            return perguntas;
        } catch (error: any) {
            throw new Error('Não foi possível buscar as perguntas.');
        }
    }

    async enviarPergunta(pergunta: PerguntaCadastro) {
        try {
            const response = await fetch(rotasApi.perguntas, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pergunta)
            });

            if (!response.ok) {
                if (response.status >= 400 && response.status < 500) {
                    const body = await response.json();
                    throw DominioException.comProblemas(body.erros)
                } else throw new Error('Não foi possível salvar a resposta.');
            }
        } catch (error) {
            if (error instanceof DominioException) {
                throw error;
            }
            
            throw new Error('Não foi possível salvar a resposta.');
        }
    }

    async buscarTodos(): Promise<PerguntaListagem[]> {
        return [];
    }
}