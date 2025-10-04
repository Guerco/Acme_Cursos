import { Curso } from "../model/Curso";

export interface VisaoListagemCursos {
    
    iniciar() : void;

    exibirCursos (cursos: Array<Curso>): void;

}   