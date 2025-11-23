import { CursoQtdAlunoRel } from "../model/dto/relatorio/CursoQtdAlunoRel.ts";
import { VisaoBase } from "./VisaoBase.ts";

export interface VisaoQtdAlunosPorCurso  extends VisaoBase{
    
    iniciar() : void;

    // Saída
    exibirGrafico (listagem: Array<CursoQtdAlunoRel>): void;
}   