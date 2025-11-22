import { VisaoQuiz } from "../view/VisaoQuiz";
import { ServicoQuiz } from "../model/servico/ServicoQuiz";
import { RepositorioAlunosAPI } from "../model/repositorio/RepositorioAlunosApi";
import { RepositorioPerguntasApi } from "../model/repositorio/RepositorioPerguntasApi";
import { RespostaAlunoCadastro } from "../model/dto/RespostaAlunoCadastro";
import { DominioException } from "../model/exception/DominioException";
import { PontuacoesAluno } from "../model/dto/PontuacoesAluno";

export class ControladoraQuiz {
    private servico: ServicoQuiz;

    constructor(
        private visao: VisaoQuiz
    ) {
        const repoAlunos = new RepositorioAlunosAPI();
        const repoPerguntas = new RepositorioPerguntasApi();
        this.servico = new ServicoQuiz(repoAlunos, repoPerguntas);
    }

    async carregarInformacoes() {
        const idAssunto = this.visao.buscarIdAssunto();

        if (!idAssunto) {
            throw new Error('ID do assunto não informado.');
        } else if (Number.isNaN(idAssunto) || !Number.isInteger(idAssunto) ) {
            throw new Error('ID do assunto deve ser inteiro e positivo.');
        }

        const pontuacoes = await this.servico.buscarPontuacoes(idAssunto);
        const perguntas = await this.servico.buscarPerguntas(idAssunto);

        if (perguntas.length === 0) {
            this.visao.exibirMensagemFim('Não há perguntas restantes para esse assunto');
            this.visao.preencherInformacoesQuiz(pontuacoes);
            this.visao.exibirMenus();
        } else {
            this.visao.carregarPerguntas(perguntas);
            await this.prepararQuiz(pontuacoes);
        }
    }

    prepararQuiz(pontuacoes: PontuacoesAluno) {
        const botao = this.visao.exibirIniciarQuiz();
        this.visao.preencherInformacoesQuiz(pontuacoes);
        this.visao.exibirMenus();

        botao.addEventListener('click', async () => {
            await this.visao.realizarContagemInicial();
            await this.iniciarQuiz();
        });
    }

    async iniciarQuiz(): Promise<void> {
        this.visao.animacaoInicioQuiz();

        const pergunta = this.visao.getPerguntas()[this.visao.getPerguntaAtual()];
        this.visao.preencherPergunta(pergunta);
        this.visao.tornarAcaoResponder();
        this.visao.iniciarContagemRegressiva(pergunta.tempoSeg);
        await this.visao.iniciarTelaCheia();
    }

    async responder(tempoEsgotado: boolean = false): Promise<boolean>{
        this.visao.limparContagem();
        this.visao.desabilitarRespostas();

        const resposta = this.visao.buscarDadosResposta();

        const acertou = await this.servico.enviarResposta(resposta);

        this.visao.exibirMensagemAcertou(acertou, tempoEsgotado);

        this.visao.tornarAcaoProximaPergunta();

        return acertou;
    }

    async tratarSaidaQuiz() {
        this.visao.limparEventosSaida();

        let acertou = null;
        let mensagem = 'Você saiu do quiz. 🚪';
        if (this.visao.buscarMensagemAcertou() == '') {
            acertou = await this.responder();
        }
        if (acertou !== null)  {
            mensagem = acertou ? 
                'Parabéns! Você acertou, mas saiu do quiz. Sua resposta foi registrada e o quiz foi encerrado. ✅' 
                : 'Ops! Você errou e saiu do quiz. Sua resposta foi registrada e o quiz foi encerrado. ❌';
        }
        this.visao.exibirMensagemFim(mensagem);
    }

    proximaPergunta() {
        this.visao.limparContagem();
        
        const perguntas = this.visao.getPerguntas();
        let perguntaAtual = this.visao.getPerguntaAtual();
        perguntaAtual++;
        
        if (perguntaAtual >= perguntas.length ) {
            this.visao.exibirMensagemFim('Parabéns! Você já respondeu todas as perguntas sobre este assunto 🎉');
            this.visao.ocultarMensagemTelaCheia();
            this.visao.limparEventosSaida();
        } else {
            this.visao.setPerguntaAtual(perguntaAtual);
            this.visao.limparMensagemAcertou();
            const pergunta = perguntas[perguntaAtual];
            this.visao.preencherPergunta(pergunta);
            this.visao.iniciarContagemRegressiva(pergunta.tempoSeg);
            this.visao.tornarAcaoResponder();
        }
    }

    async enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean> {
        try {
            return await this.servico.enviarResposta(respostaAluno);
        } catch (err: any) {
            throw err;
        }
    }
}