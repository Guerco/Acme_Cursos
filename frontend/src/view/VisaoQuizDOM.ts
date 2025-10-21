import { VisaoQuiz } from "./VisaoQuiz.ts";
import { ControladoraQuiz } from "../presenter/ControladoraQuiz.ts"
import { rotasPaginas } from "../rotas.ts";
import { AlunoListagem } from "../model/dto/AlunoListagem.ts";
import { Credenciais } from "../model/dto/Credenciais.ts";
import { PerguntaListagem } from "../model/dto/PerguntaListagem.ts";
import { ids } from "../ui/quiz-ui.ts";
import { UtilDOM} from "../util/UtilDOM.ts"
import { Dificuldade, dificuldadeParaString, dificuldadeParaTextoValor, dificuldadeDeString } from "../model/Dificuldade.ts";

const DIRETORIO_IMAGENS = '../../img/perguntas/';

export class VisaoQuizDOM implements VisaoQuiz{
    private controladora: ControladoraQuiz;
    private modal!: HTMLDialogElement;
    private perguntas : PerguntaListagem[] = [];
    private perguntaAtual : number = 0;

    constructor() {
        this.controladora = new ControladoraQuiz(this);
    }

    iniciar(): void{
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

    chamarModal():void{
        this.modal.showModal();
    }

    buscarParametrosUrl() : {idAssunto: number} {
        const params = new URLSearchParams(window.location.search);
        const idAssunto = Number(params.get('assunto'));

        if (!idAssunto) {
            alert('ID do assunto não informado na URL.');
        }

        return {
            idAssunto: idAssunto
        };
    }

    // Entradas
    buscarCredenciais(): Credenciais{
        const form = document.getElementById(ids.formCredenciais) as (HTMLFormElement);
        const credenciais = Object.fromEntries(new FormData(form).entries()) as { email: string; senha: string };
        return credenciais;
    }

    iniciarQuiz(perguntas: PerguntaListagem[]): void{
        this.perguntas = perguntas;
        this.perguntaAtual = 0;
        this.preencherPergunta(this.perguntas[this.perguntaAtual]);
    }

    // Saídas
    exibirMensagemCredenciais(mensagem: string): void {
        const out = document.querySelector(`#${ids.dialogCredenciais} output`) as HTMLOutputElement;
        out.innerText = mensagem;
    }

    fecharFormCredenciais(){
        this.modal.close();
        this.modal.hidden = true;
    }

    irParaPaginaCursos(): void{
        location.href = rotasPaginas.listagemCursos;
    }

    private preencherPergunta(pergunta: PerguntaListagem):void{
        const divQuiz = document.getElementById('quiz') as HTMLDivElement;
        divQuiz.innerHTML = '';

        const frag  = document.createDocumentFragment();

        const divPergunta = UtilDOM.criaComClasses('div', ['pergunta']);
        divPergunta.dataset.id = pergunta.id.toString();
        divPergunta.dataset.dificuldade = pergunta.dificuldade;

        const dif = dificuldadeDeString(pergunta.dificuldade);

        const dificuldade = UtilDOM.criaComTextoEClasses('p', 
            dificuldadeParaTextoValor(dif!),
            [
                'dificuldade',
                'dificuldade-'+dificuldadeParaString(dif!)
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

        for(const r of pergunta.respostas){
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

    exibirMensagemFim(mensagemEncerramento: string):void {
        const divQuiz = document.getElementById('quiz')!;
        divQuiz.innerHTML = '';

        const divMensagem = UtilDOM.criaComClasses('div', ['div-mensagem-fim']);
        const mensagem = UtilDOM.criaComTexto('h3', mensagemEncerramento);

        const botao = UtilDOM.criaComTextoEClasses('a', 'Voltar para Cursos 🏡', ['botao-voltar-cursos']) as HTMLAnchorElement;
        botao.href = rotasPaginas.listagemCursos; 

        divMensagem.append(mensagem, botao);
        divQuiz.appendChild(divMensagem);
    }

    alternarSelecaoResposta(event: Event):void{
        const target = event.target as HTMLElement;
        const resposta = target.closest('.resposta');
        resposta!.classList.toggle('resposta-selecionada');
    }

    // Auxiliar
    carregarPerguntas(perguntas : PerguntaListagem[]) {
        this.perguntas = perguntas;
        this.perguntaAtual = 0;
        this.preencherPergunta(this.perguntas[this.perguntaAtual]);
    }

    
}




