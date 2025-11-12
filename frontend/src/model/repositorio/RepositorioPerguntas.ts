import { PerguntaCadastro } from "../dto/PerguntaCadastro";
import { PerguntaListagem } from "../dto/PerguntaListagem";

export interface RepositorioPerguntas{
    buscarPerguntas(idAluno: number, idAssunto: number) : Promise<PerguntaListagem[]>;
    buscarTodos() : Promise<PerguntaListagem[]>;
    enviarPergunta(pergunta: PerguntaCadastro) : Promise<void>;
}

