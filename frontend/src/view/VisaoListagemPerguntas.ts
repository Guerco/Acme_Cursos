import { PerguntaListagem } from "../model/dto/PerguntaListagem.ts";

export interface VisaoListagemPerguntas {
    
    iniciar() : void;

    // Entrada
    obterIdAssunto() : number|null;

    // Saída
    exibirMensagem (mensagem : string []) : void;
    exibirPerguntas(perguntas: PerguntaListagem[], assunto: string|null): void;
}   