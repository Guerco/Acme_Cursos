import { CursoQtdAlunoRel } from "../model/dto/relatorio/CursoQtdAlunoRel.ts";

export interface VisaoQtdAlunosPorCurso {
    
    iniciar() : void;

    // Saída
    exibirGrafico (listagem: Array<CursoQtdAlunoRel>): void;
}   