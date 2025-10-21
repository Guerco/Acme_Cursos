import { AlunoListagem } from "../model/dto/AlunoListagem";
import { Credenciais } from "../model/dto/Credenciais";
import { PerguntaListagem } from "../model/dto/PerguntaListagem";

export interface VisaoQuiz{
    iniciar(): void;

    //Entrada
    buscarCredenciais(): Credenciais;
    buscarParametrosUrl(): {idAssunto: number};
    chamarModal():void;

    //Saída
    exibirMensagemCredenciais(mensagem: string):void;
    fecharFormCredenciais():void;
    irParaPaginaCursos(): void;

    //auxiliar
    carregarPerguntas(perguntas: PerguntaListagem[]):void;
}