import { AlunoRel } from "../dto/relatorio/AlunoRel";
import { AlunoCursoRel } from "../dto/relatorio/AlunoCursoRel";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";
import { PontuacoesAluno } from "../dto/PontuacoesAluno";

export interface RespositorioAlunos{
    enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean>;
    buscarRankingAlunos(filtro: string) : Promise<AlunoRel[]>;
    buscarRankingAlunosCurso(filtro: string) : Promise<AlunoCursoRel[]>;
    buscarPontuacoesAluno(idAssunto: number) : Promise<PontuacoesAluno>;
    buscarQuizAleatorio() : Promise<number|boolean>;
}