import { AlunoListagem } from "../model/dto/AlunoListagem";
import { Credenciais } from "../model/dto/Credenciais";

export interface VisaoQuiz{
    iniciar(): void;

    //Entrada
    buscarCredenciais(): Credenciais;

    //Saída
    exibirMensagemCredenciais(mensagem: string):void;
    fecharFormCredenciais(aluno: AlunoListagem):void;
    irParaPaginaCursos(): void;
}