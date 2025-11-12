import { rotasJsonServer } from "../../rotas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { RepositorioPerguntas } from "../repositorio/RepositorioPerguntas";

const URL_API = rotasJsonServer.perguntasListagem;

export class ServicoListagemPerguntas {
    constructor(private repositorio : RepositorioPerguntas){}

    async buscarTodos(idAssunto: number|null = null) : Promise<PerguntaListagem[]> {
        return await this.repositorio.buscarTodosOuPorAssunto(idAssunto);
    }
}