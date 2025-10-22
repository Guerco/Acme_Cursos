import {AlunoListagem} from "../dto/AlunoListagem";
import {Credenciais} from "../dto/Credenciais";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";

export interface RespositorioAlunos{
    verificarCredenciais(credenciais: Credenciais): Promise<AlunoListagem>;
    buscarPontuacaoAlunoCurso(idAluno: number, idCurso: number): Promise<number>;
    enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean>;
}