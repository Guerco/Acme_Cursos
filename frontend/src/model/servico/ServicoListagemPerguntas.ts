import { rotasJsonServer } from "../../rotas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { RepositorioPerguntas } from "../repositorio/RepositorioPerguntas";

const URL_API = rotasJsonServer.perguntasListagem;

export class ServicoListagemPerguntas {
    constructor(private repositorio : RepositorioPerguntas){}

    async buscarTodos() : Promise<PerguntaListagem[]> {
        try {
            return await this.repositorio.buscarTodos();
        } catch(err : any) {
            throw new Error(err.message);
        }
    }
}