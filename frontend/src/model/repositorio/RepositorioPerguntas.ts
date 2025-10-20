import { PerguntaListagem } from "../dto/PerguntaListagem";

export interface RepositorioPerguntas{
    buscarPerguntas(idAluno: number, idAssunto: number) : Promise<PerguntaListagem[]>;

}

