import { PerguntaListagem } from "../model/dto/PerguntaListagem.ts";

export interface VisaoListagemPerguntas {
    
    iniciar() : void;

    // Entrada

    // Saída
    exibirMensagem (mensagem : string) : void;
    exibirPerguntas (perguntas: PerguntaListagem[]): void ;
}   