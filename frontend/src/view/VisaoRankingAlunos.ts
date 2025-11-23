import { AlunoCursoRel } from "../model/dto/relatorio/AlunoCursoRel";
import { AlunoRel } from "../model/dto/relatorio/AlunoRel";
import { VisaoBase } from "./VisaoBase";

export interface VisaoRankingAlunos extends VisaoBase{
    // Métodos de Entrada
    buscarTextoBusca () : string;
    buscarTipoRanking () : string;

    // Métodos de Saída
    preencherTabela(ranking: AlunoRel[]|AlunoCursoRel[]) : void;
    alterarCaptionBusca (texto : string) : void;
}