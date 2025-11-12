import { Credenciais } from "../model/dto/Credenciais";
import { PerguntaListagemQuiz } from "../model/dto/PerguntaListagemQuiz";
import { RespostaAlunoCadastro } from "../model/dto/RespostaAlunoCadastro";

export interface VisaoQuiz {
    iniciar(): void;

    //Entrada
    buscarCredenciais(): Credenciais;
    buscarParametrosUrl(): { idAssunto: number; idCurso: number };
    chamarModal(): void;
    buscarDadosResposta(credenciais: Credenciais): RespostaAlunoCadastro;
    buscarMensagemAcertou() : string;

    //Saída
    exibirMensagemCredenciais(mensagem: string): void;
    exibirMensagemFim(mensagemEncerramento: string): void;
    exibirIniciarQuiz() : HTMLButtonElement;
    fecharFormCredenciais(): void;
    irParaPaginaCursos(): void;
    exibirMensagemAcertou(acertou: boolean, tempoEsgotado: boolean): void;
    limparContagem(): void;
    desabilitarRespostas(): void;
    tornarAcaoProximaPergunta(): void;
    limparEventosSaida(): void;
    preencherInformacoesAluno(nome: string, pontuacaoGeral: number, pontuacaoCurso: number) : void;
    preencherPergunta(pergunta: PerguntaListagemQuiz): void;
    tornarAcaoResponder() : void;
    iniciarTelaCheia() : void;
    iniciarContagemRegressiva(segundos: number): Promise<void>;
    exibirMenus() : void;
    realizarContagemInicial() : void;
    limparMensagemAcertou() : void;
    ocultarMensagemTelaCheia() : void;
    // Auxiliar
    carregarPerguntas(perguntas: PerguntaListagemQuiz[]): void;
    getPerguntas() : PerguntaListagemQuiz[];
    getPerguntaAtual() : number;
    setPerguntaAtual(valor : number): void;
}
