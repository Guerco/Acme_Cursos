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
    exibirIniciarQuiz() : HTMLButtonElement;
    fecharFormCredenciais(): void;
    irParaPaginaCursos(): void;
    exibirMensagemAcertou(acertou: boolean, tempoEsgotado: boolean): void;
    limparContagem(): void;
    desabilitarRespostas(): void;
    exibirProximaPergunta(): void;
    tornarAcaoProximaPergunta(): void;
    limparEventosSaida(): void;
    carregarPerguntas(perguntas: PerguntaListagem[]): void;
    preencherInformacoesAluno(nome: string, pontuacaoGeral: number, pontuacaoCurso: number) : void;
    preencherPergunta(pergunta: PerguntaListagem): void;
    tornarAcaoResponder() : void;
    iniciarTelaCheia() : void;
    iniciarContagemRegressiva(segundos: number): Promise<void>;
    exibirMenus() : void;
    realizarContagemInicial() : void;
    // Auxiliar
    getPerguntas() : PerguntaListagem[];
    getPerguntaAtual() : number;
}
