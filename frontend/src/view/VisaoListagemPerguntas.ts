import { PerguntaListagem } from "../model/dto/PerguntaListagem.ts";
import { VisaoBase } from "./VisaoBase.ts";

export interface VisaoListagemPerguntas extends VisaoBase{
    
    iniciar() : void;

    // Entrada
    obterIdAssunto() : number|null;

    // Saída
    exibirMensagem (mensagem : string []) : void;
    exibirPerguntas(perguntas: PerguntaListagem[], assunto: string|null): void;
}   