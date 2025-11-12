import { PerguntaCadastro } from "../dto/PerguntaCadastro";
import { PerguntaListagemQuiz } from "../dto/PerguntaListagemQuiz";
import { PerguntaListagem } from "../dto/PerguntaListagem";

export interface RepositorioPerguntas{
    buscarPerguntas(idAluno: number, idAssunto: number) : Promise<PerguntaListagemQuiz[]>;
    buscarTodosOuPorAssunto(idAssunto: number|null) : Promise<PerguntaListagem[]>;
    enviarPergunta(pergunta: PerguntaCadastro) : Promise<void>;
}

