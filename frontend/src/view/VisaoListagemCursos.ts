import { CursoListagem } from "../model/dto/CursoListagem.ts";

export interface VisaoListagemCursos {
    
    iniciar() : void;

    // Entrada
    obterFiltroBusca() : string 

    // Saída
    exibirMensagem (mensagem : string) : void;
    exibirCursos (cursos: Array<CursoListagem>): void;
}   