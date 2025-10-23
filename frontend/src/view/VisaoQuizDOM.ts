import { VisaoQuiz } from "./VisaoQuiz.ts";
import { ControladoraQuiz } from "../presenter/ControladoraQuiz.ts";
import { rotasPaginas } from "../rotas.ts";
import { Credenciais } from "../model/dto/Credenciais.ts";
import { PerguntaListagem } from "../model/dto/PerguntaListagem.ts";
import { classes, ids } from "../ui/quiz-ui.ts";
import { UtilDOM } from "../util/UtilDOM.ts"
import { Dificuldade, dificuldadeParaString, dificuldadeParaTextoValor, dificuldadeDeString, dificuldadeValor } from "../model/Dificuldade.ts";
import { RespostaAlunoCadastro } from "../model/dto/RespostaAlunoCadastro.ts";

const DIRETORIO_IMAGENS = '../../img/perguntas/';

export class VisaoQuizDOM implements VisaoQuiz {
    private controladora: ControladoraQuiz;
    private modal!: HTMLDialogElement;
    private perguntas: PerguntaListagem[] = [];
    private perguntaAtual!: number;
    private botaoAcao!: HTMLButtonElement;
    private contagemRegressivaResposta!: number;
    private contagem!: HTMLElement;
    private dificuldadePergunta!: Dificuldade;

    constructor() {
        this.controladora = new ControladoraQuiz(this);
    }

    iniciar(): void {
        this.botaoAcao = document.getElementById(ids.botaoAcao) as HTMLButtonElement;
        this.contagem = document.getElementById(ids.botaoContagem) as HTMLElement;

        this.modal = document.getElementById(ids.dialogCredenciais) as HTMLDialogElement;

        this.modal.showModal();

        const botaoCancelar = document.getElementById(ids.cancelarCredenciais) as HTMLButtonElement;
        botaoCancelar!.addEventListener('click', (event) => {
            this.controladora.redirecionarParaCursos();
        });

        this.modal.addEventListener('submit', (event) => {
            event.preventDefault();

            this.controladora.verificarCredenciais();
        });

        const botaoInfoCredenciais = document.getElementById(ids.botaoInformarCredenciais) as HTMLButtonElement;
        botaoInfoCredenciais!.addEventListener('click', (event) => {
            this.controladora.exibirInformarCredenciais();
        });

    }

    chamarModal(): void {
        this.modal.showModal();
    }

    buscarParametrosUrl(): { idAssunto: number, idCurso: number } {
        const params = new URLSearchParams(window.location.search);
        const idAssunto = Number(params.get('assunto'));
        const idCurso = Number(params.get('curso'));

        if (!idAssunto || !idCurso) {
            throw new Error('ID do assunto ou curso não informado na URL.');
        }

        return {
            idAssunto: idAssunto,
            idCurso: idCurso
        };
    }

    // Entradas
    buscarCredenciais(): Credenciais {
        const form = document.getElementById(ids.formCredenciais) as (HTMLFormElement);
        const credenciais = new Credenciais(form.email.value, form.senha.value);
        return credenciais;
    }

    async realizarContagemInicial() {
        const divQuiz = document.getElementById(ids.quiz) as HTMLDivElement;
        divQuiz.innerHTML = '';
        const contagemInicial = UtilDOM.criaComTextoEClasses('h1', 'Iniciando em', ['contagem-inicial']);
        divQuiz.appendChild(contagemInicial);
        let tempoRestante = 3;

        return new Promise<void>(resolve => {
            const intervaloInicio = setInterval(() => {
                if (tempoRestante <= 0) {
                    clearInterval(intervaloInicio);
                    resolve();
                }
                contagemInicial.innerText = (tempoRestante--).toString();
            }, 1000);
        });
    }

    buscarDadosResposta(credenciais: Credenciais): RespostaAlunoCadastro {
        const pergunta = document.querySelector(`.${classes.pergunta}`);

        const idPergunta = (pergunta as HTMLElement).dataset.id;

        const respostas = document.querySelectorAll(`.${classes.respostaSelecionada}`);

        const idsRespostas = [];
        for (const r of respostas) {
            idsRespostas.push(Number((r as HTMLElement).dataset.id));
        }

        return new RespostaAlunoCadastro(credenciais, Number(idPergunta), idsRespostas);
    }

    buscarMensagemAcertou() : string {
        const mensagem = document.getElementById(ids.mensagemResposta);

        return (mensagem as HTMLElement).innerText;
    }

    // Saídas
    exibirIniciarQuiz(): HTMLButtonElement {
        const divQuiz = document.getElementById(ids.quiz) as HTMLDivElement;
        divQuiz.innerHTML = '';

        const botaoIniciar = UtilDOM.criaComTextoEClasses('button', 'Clique aqui para iniciar o quiz', ['botao-iniciar-quiz']);
        divQuiz.appendChild(botaoIniciar);
        return botaoIniciar as HTMLButtonElement;
    }

    exibirMensagemCredenciais(mensagem: string): void {
        const out = document.querySelector(`#${ids.dialogCredenciais} output`) as HTMLOutputElement;
        out.innerText = mensagem;
    }

    fecharFormCredenciais() {
        this.modal.close();
        this.modal.hidden = true;
    }

    irParaPaginaCursos(): void {
        location.href = rotasPaginas.listagemCursos;
    }


    preencherPergunta(pergunta: PerguntaListagem): void {
        const divQuiz = document.getElementById(ids.quiz) as HTMLDivElement;
        divQuiz.innerHTML = '';

        const frag = document.createDocumentFragment();

        const divPergunta = UtilDOM.criaComClasses('div', ['pergunta']);
        divPergunta.dataset.id = pergunta.id.toString();
        divPergunta.dataset.dificuldade = pergunta.dificuldade;

        this.dificuldadePergunta = (dificuldadeDeString(pergunta.dificuldade) as Dificuldade);

        const dificuldade = UtilDOM.criaComTextoEClasses('p',
            dificuldadeParaTextoValor(this.dificuldadePergunta!),
            [
                'dificuldade',
                'dificuldade-' + dificuldadeParaString(this.dificuldadePergunta!)
            ]
        );
        divPergunta.appendChild(dificuldade);

        const containerPergunta = UtilDOM.criaComClasses('div', ['pergunta-container']);
        const descricaoPergunta = UtilDOM.criaComTexto('h1', pergunta.descricao);
        containerPergunta.appendChild(descricaoPergunta);
        if (pergunta.caminhoImg) {
            const figura = UtilDOM.criaImg(DIRETORIO_IMAGENS + pergunta.caminhoImg);
            containerPergunta.appendChild(figura);
        }

        divPergunta.appendChild(containerPergunta);

        const ulRespostas = UtilDOM.criaComClasses('ul', ['respostas']);

        for (const r of pergunta.respostas) {
            let liResposta = UtilDOM.criaComClasses('li', ['resposta']);
            liResposta.dataset.id = r.id.toString();

            const botao = UtilDOM.criaComTexto('button', r.descricao);
            botao.addEventListener('click', (event) => this.alternarSelecaoResposta(event));

            liResposta.appendChild(botao);
            ulRespostas.appendChild(liResposta);
        }

        frag.append(divPergunta, ulRespostas);

        divQuiz.appendChild(frag);
    }

    exibirMensagemFim(mensagemEncerramento: string): void {
        const divQuiz = document.getElementById(ids.quiz)!;
        divQuiz.innerHTML = '';

        const divMensagem = UtilDOM.criaComClasses('div', ['div-mensagem-fim']);
        const mensagem = UtilDOM.criaComTexto('h3', mensagemEncerramento);

        const botao = UtilDOM.criaComTextoEClasses('a', 'Voltar para Cursos 🏡', ['botao-voltar-cursos']) as HTMLAnchorElement;
        botao.href = rotasPaginas.listagemCursos;

        divMensagem.append(mensagem, botao);
        divQuiz.appendChild(divMensagem);

        this.ocultarFooter();
    }

    alternarSelecaoResposta(event: Event): void {
        const target = event.target as HTMLElement;
        const resposta = target.closest('.resposta');
        resposta!.classList.toggle('resposta-selecionada');
    }

    exibirMensagemAcertou(acertou: boolean, tempoEsgotado: boolean) {
        const mensagem = document.getElementById(ids.mensagemResposta) as HTMLElement;

        if (acertou) {
            let valor = dificuldadeValor(this.dificuldadePergunta);
            this.incrementarPontuacaoExibida(valor);
            mensagem.innerText = tempoEsgotado ? 'Tempo esgotado. Mas você acertou!' : 'Você acertou!';
        } else mensagem.innerText = tempoEsgotado ? 'Tempo esgotado. Você errou.' : 'Você errou...';
    }

    preencherInformacoesAluno(nome: string, pontuacaoGeral: number, pontuacaoCurso: number) {
        const h2Usuario = document.getElementById(ids.usuario);
        (h2Usuario as HTMLElement).textContent = nome;

        const inputPontuacaoGeral = document.getElementById(ids.pontuacaoGeral);
        (inputPontuacaoGeral as HTMLInputElement).value = pontuacaoGeral.toFixed(1);

        const inputPontuacaoCurso = document.getElementById(ids.pontuacaoCurso);
        (inputPontuacaoCurso as HTMLInputElement).value = pontuacaoCurso.toFixed(1);
    }

    incrementarPontuacaoExibida(valor: number) {
        const inputPontuacaoGeral = document.getElementById(ids.pontuacaoGeral);
        let pontuacaoAtual = Number((inputPontuacaoGeral as HTMLInputElement).value);
        pontuacaoAtual += valor;
        (inputPontuacaoGeral as HTMLInputElement).value = pontuacaoAtual.toFixed(1);

        const inputPontuacaoCurso = document.getElementById(ids.pontuacaoCurso);
        pontuacaoAtual = Number((inputPontuacaoCurso as HTMLInputElement).value);
        pontuacaoAtual += valor;
        (inputPontuacaoCurso as HTMLInputElement).value = pontuacaoAtual.toFixed(1);
    }

    tornarAcaoProximaPergunta() {
        this.botaoAcao.classList.remove(classes.responder);
        this.botaoAcao.classList.add(classes.proxima);

        this.botaoAcao.onclick = () => this.controladora.proximaPergunta();

        this.botaoAcao.innerText = 'Próxima Pergunta';
    }

    tornarAcaoResponder() {
        this.botaoAcao.classList.remove(classes.proxima);
        this.botaoAcao.classList.add(classes.responder);

        this.botaoAcao.onclick = () => this.controladora.responder(false);

        this.botaoAcao.innerText = 'Responder';
    }


    limparContagem() {
        clearInterval(this.contagemRegressivaResposta);
        this.contagem.innerText = '⏳0.0s';
    }

    desabilitarRespostas() {
        const respostas = document.querySelectorAll(`.${classes.resposta}`);

        for (const r of respostas) {
            const botao = r.querySelector('button');
            (botao as HTMLButtonElement).disabled = true;
        }
    }

    exibirProximaPergunta() {
        this.perguntaAtual++;
        if (this.perguntaAtual >= this.perguntas.length) {
            this.exibirMensagemFim('Parabéns! Você já respondeu todas as perguntas sobre este assunto 🎉');
            this.ocultarMensagemTelaCheia();
            this.limparEventosSaida();
            return;
        }

        
        this.preencherPergunta(this.perguntas[this.perguntaAtual]);
    }

    limparMensagemAcertou() {
        const mensagem = document.getElementById(ids.mensagemResposta);

        (mensagem as HTMLElement).innerText = '';
    }

    limparEventosSaida() {
        document.removeEventListener('fullscreenchange', this.tratarSaidaTelaCheia);
        window.removeEventListener('blur', this.tratarSaidaQuiz);
        window.removeEventListener('beforeunload', this.tratarSaidaQuiz);
        window.removeEventListener('visibilitychange', this.tratarSaidaQuiz);
    }

    ocultarMensagemTelaCheia() {
        const mensagem = document.querySelector(`.${classes.atencaoTela}`) as HTMLDivElement;
        mensagem!.hidden = true;
    }

    exibirMenus() {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');

        (header as HTMLElement).hidden = false;
        (footer as HTMLElement).hidden = false;
    }

    // Auxiliar
    getPerguntas(): PerguntaListagem[] {
        return this.perguntas;
    }

    getPerguntaAtual(): number {
        return this.perguntaAtual;
    }

    setPerguntaAtual(valor : number): void {
        this.perguntaAtual = valor;
    }

    carregarPerguntas(perguntas: PerguntaListagem[]) {
        this.perguntas = perguntas;
        this.perguntaAtual = 0;
    }

    private ocultarFooter() {
        const footer = document.querySelector('footer');

        (footer as HTMLElement).hidden = true;
    }

    async iniciarContagemRegressiva(segundos: number): Promise<void> {
        let tempoRestante = segundos;

        this.contagemRegressivaResposta = setInterval(async () => {
            const exibido = Math.max(tempoRestante, 0).toFixed(1);
            this.contagem.innerText = `⏳${exibido}s`;

            if (tempoRestante <= 0) {
                await this.controladora.responder(true);
            }

            tempoRestante -= 0.1;
        }, 100);
    }

    iniciarTelaCheia() {
        document.documentElement.requestFullscreen();
        document.addEventListener('fullscreenchange', this.tratarSaidaTelaCheia);
        window.addEventListener('blur', this.tratarSaidaQuiz);
        window.addEventListener('beforeunload', this.tratarSaidaQuiz);
        window.addEventListener('visibilitychange', this.tratarSaidaQuiz);
    }

    private tratarSaidaQuiz = async () => {
        this.piscarMensagemSaidaTela();
        await this.controladora.tratarSaidaQuiz();
    }
    private tratarSaidaTelaCheia = async () => {
        if (!document.fullscreenElement) {
            this.piscarMensagemSaidaTela();
            await this.controladora.tratarSaidaQuiz();
        }
    }

    private piscarMensagemSaidaTela() {
        const aviso = document.querySelector(`.${classes.atencaoTela}`);

        let tempo = 0;
        const piscaPisca = setInterval(() => {
            if (tempo >= 5)
                clearInterval(piscaPisca);
            aviso!.classList.toggle('atencao-tela-cheia-destaque');
            tempo += 1;
        }, 500);
    }
}