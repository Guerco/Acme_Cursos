import { Credenciais } from "../model/dto/Credenciais";
import { PerguntaListagemQuiz } from "../model/dto/PerguntaListagemQuiz";
import { PontuacoesAluno } from "../model/dto/PontuacoesAluno";
import { RespostaAlunoCadastro } from "../model/dto/RespostaAlunoCadastro";

export interface VisaoQuiz {
    iniciar(): void;

    //Entrada
    buscarCredenciais(): Credenciais;
    buscarIdAssunto(): number;
    buscarDadosResposta(): RespostaAlunoCadastro;
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
    preencherInformacoesQuiz(pontuacoes: PontuacoesAluno) : void;
    preencherPergunta(pergunta: PerguntaListagemQuiz): void;
    tornarAcaoResponder() : void;
    iniciarTelaCheia() : void;
    iniciarContagemRegressiva(segundos: number): Promise<void>;
    exibirMenus() : void;
    realizarContagemInicial() : void;
    limparMensagemAcertou() : void;
    ocultarMensagemTelaCheia() : void;
    animacaoInicioQuiz() : void;

    // Auxiliar
    carregarPerguntas(perguntas: PerguntaListagemQuiz[]): void;
    getPerguntas() : PerguntaListagemQuiz[];
    getPerguntaAtual() : number;
    setPerguntaAtual(valor : number): void;
}
