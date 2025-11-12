import { RepositorioPerguntas } from "./RepositorioPerguntas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { PerguntaListagemQuiz } from "../dto/PerguntaListagemQuiz";
import { rotasApi, rotasJsonServer } from "../../rotas";
import { PerguntaCadastro } from "../dto/PerguntaCadastro";

const URL_API = rotasJsonServer.perguntas;
const URL_API_LISTAGEM = rotasJsonServer.perguntasListagem;

export class RepositorioPerguntasJsonServer implements RepositorioPerguntas {

    async buscarPerguntas(idAluno: number, idAssunto: number): Promise<PerguntaListagemQuiz[]> {
        return [];
    }

    async enviarPergunta(pergunta: PerguntaCadastro): Promise<void> {
        try {
            const response = await fetch(URL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pergunta)
            });

            if (!response.ok) {
                throw new Error();
            }
        } catch (err) {
            throw new Error('Não foi possível cadastrar a pergunta.');
        }
    }

    async buscarTodosOuPorAssunto(idAssunto: number|null = null) : Promise<PerguntaListagem[]> {
        try {
            const response = await fetch(URL_API_LISTAGEM);

            if (!response.ok) {
                throw new Error();
            }

            return await response.json();
        } catch (err) {
            throw new Error('Não foi possível buscar as perguntas.');
        }
    }
}