import {AlunoListagem} from "../dto/AlunoListagem";
import {Credenciais} from "../dto/Credenciais";
import { AlunoRel } from "../dto/relatorio/AlunoRel";
import { AlunoCursoRel } from "../dto/relatorio/AlunoCursoRel";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";

export interface RespositorioAlunos{
    verificarCredenciais(credenciais: Credenciais): Promise<AlunoListagem>;
    buscarPontuacaoAlunoCurso(idAluno: number, idCurso: number): Promise<number>;
    enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean>;
    buscarRankingAlunos() : Promise<AlunoRel[]>;
    buscarRankingAlunosCurso() : Promise<AlunoCursoRel[]>;
}