import { AlunoListagem } from "../model/dto/AlunoListagem";
import { Credenciais } from "../model/dto/Credenciais";
import { PerguntaListagem } from "../model/dto/PerguntaListagem";
import { RespostaAlunoCadastro } from "../model/dto/RespostaAlunoCadastro";

export interface VisaoQuiz {
    iniciar(): void;

    //Entrada
    buscarCredenciais(): Credenciais;
    buscarParametrosUrl(): { idAssunto: number; idCurso: number };
    chamarModal(): void;
    buscarDadosResposta(credenciais: Credenciais): RespostaAlunoCadastro;

    //Saída
    exibirMensagemCredenciais(mensagem: string): void;
    exibirMensagemFim(mensagemEncerramento: string): void;
    fecharFormCredenciais(): void;
    irParaPaginaCursos(): void;
    iniciarQuiz(aluno: AlunoListagem, pontuacaoCurso: number): void;
    tornarAcaoProximaPergunta(): void;
    exibirMensagemAcertou(acertou: boolean, tempoEsgotado: boolean): void;
    limparContagem(): void;
    desabilitarRespostas(): void;
    exibirProximaPergunta(): void;

    //auxiliar
    carregarPerguntas(perguntas: PerguntaListagem[]): void;
}
