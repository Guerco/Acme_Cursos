import { RepositorioPerguntas } from "./RepositorioPerguntas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { rotasApi, rotasJsonServer } from "../../rotas";
import { PerguntaCadastro } from "../dto/PerguntaCadastro";

const URL_API = rotasJsonServer.perguntas;


export class RepositorioPerguntasJsonServer implements RepositorioPerguntas {

    async buscarPerguntas(idAluno: number, idAssunto: number): Promise<PerguntaListagem[]> {
        return [];
    }

    async cadastrarPergunta(pergunta: PerguntaCadastro): Promise<void> {
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

}