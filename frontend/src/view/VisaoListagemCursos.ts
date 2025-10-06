import { Curso } from "../model/Curso";

export interface VisaoListagemCursos {
    
    iniciar() : void;

    // Entrada
    obterFiltroBusca() : string 

    // Saída
    exibirMensagem (mensagem : string) : void;
    exibirCursos (cursos: Array<Curso>): void;
}   