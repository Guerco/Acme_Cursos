import {AlunoListagem} from "../dto/AlunoListagem";
import {Credenciais} from "../dto/Credenciais";

export interface RespositorioAlunos{

    verificarCredenciais(credenciais: Credenciais): Promise<AlunoListagem>;

}