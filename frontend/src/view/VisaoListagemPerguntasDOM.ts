import { classes, classesCss, ids } from "../ui/listagem-perguntas-ui";
import { UtilDOM } from "../util/UtilDOM.ts";
import { VisaoListagemPerguntas } from "./VisaoListagemPerguntas.ts";
import { rotasApi } from "../rotas.ts";
import { PerguntaListagem } from "../model/dto/PerguntaListagem.ts";
import { RespostaPerguntaCadastro } from "../model/dto/RespostaPerguntaCadastro.ts";
import { ControladoraListagemPerguntas } from "../presenter/ControladoraListagemPerguntas.ts";

const DIRETORIO_IMAGENS = rotasApi.imagensPerguntas;

export class VisaoListagemPerguntasDOM implements VisaoListagemPerguntas {
    private controladora: ControladoraListagemPerguntas;
    private outMensagem!: HTMLOutputElement;
    private secaoPerguntas!: HTMLDivElement; 

    constructor() {
        this.controladora = new ControladoraListagemPerguntas(this);
    }

    iniciar() {
        this.carregarElementos();

        this.controladora.listarPerguntas();
    }

    // Métodos de Entrada

    // Métodos de Saída
    exibirMensagem(mensagem: string): void {
        this.outMensagem.innerText = mensagem;
    }

    exibirPerguntas(perguntas: PerguntaListagem[]): void {
        if (!perguntas || perguntas.length === 0) {
            this.exibirMensagem('Não há perguntas para se listar.');
        } else {
            const cardsPerguntas = this.perguntasParaCards(perguntas);

            const frag = UtilDOM.criaFragmentoComElementos(cardsPerguntas);

            this.secaoPerguntas.appendChild(frag);
        }
    }

    // Métodos Auxiliares
    private carregarElementos() {
        this.outMensagem = document.getElementById(ids.mensagem) as HTMLOutputElement;
        this.secaoPerguntas = document.getElementById(ids.secaoPerguntas) as HTMLDivElement;
    }

    private perguntasParaCards(perguntas: PerguntaListagem[]): HTMLDivElement[] {
        if (!perguntas || perguntas.length === 0) {
            return [UtilDOM.criaComTexto('h3', 'Não há perguntas para se listar.') as HTMLDivElement];
        }

        return perguntas.map(p => this.perguntaParaCard(p));
    }

    private perguntaParaCard(pergunta: PerguntaListagem): HTMLDivElement {
        const card = UtilDOM.criaComClasses('div', [classes.pergunta]);
        card.addEventListener('click', this.alternarVisibilidadeRespostas);

        let figura = null;
        if (pergunta.caminhoImg) {
            figura = UtilDOM.criaImg(DIRETORIO_IMAGENS+pergunta.caminhoImg);
        }

        const containerPergunta = UtilDOM.criaComClasses('div', [classes.containerPergunta]);

        const infoPergunta = UtilDOM.criaComClasses('div', [classes.infoPergunta]);

        const h2Descricao = UtilDOM.criaComTextoEClasses('h2', pergunta.descricao, [classes.descricaoPergunta]);

        const divDetalhes = UtilDOM.criaComClasses('div', [classes.detalhesPergunta]);
        const pAssunto = UtilDOM.criaComTextoEClasses('p', `💬 Assunto: ${pergunta.descricaoAssunto}`, [classes.descricaoAssunto]);
        const pDificuldade = UtilDOM.criaComTextoEClasses('p', `🧠 Dificuldade: ${pergunta.dificuldade}`, [classes.dificuldade]);
        const pTempo = UtilDOM.criaComTextoEClasses('p', `⌛ Tempo: ${pergunta.tempoSeg}s`, [classes.tempoSeg]);
        const pUltimaAtualizacao = UtilDOM.criaComTextoEClasses('p', `🔄 Última Atualização: ${pergunta.ultimaAtualizacao}`, [classes.ultimaAtualizacao]);

        divDetalhes.append(pAssunto, pDificuldade, pTempo, pUltimaAtualizacao);
        infoPergunta.append(h2Descricao, divDetalhes);

        if (figura) containerPergunta.appendChild(figura);
        containerPergunta.appendChild(infoPergunta);

        const containerRespostas = UtilDOM.criaComClasses('div', [classes.containerRespostas]);
        containerRespostas.appendChild(this.respostasParaTabela(pergunta.respostas));
        containerRespostas.hidden = true;

        const containerAcoes = UtilDOM.criaComClasses('div', [classes.perguntaAcoes]);
        const botaoExibirRespostas = UtilDOM.criaComTextoEClasses('button', 'exibir respostas', [classes.botaoExibirRespostas]);
        botaoExibirRespostas.addEventListener('click', this.alternarVisibilidadeRespostas);
        containerAcoes.appendChild(botaoExibirRespostas);

        card.append(containerPergunta, containerRespostas, containerAcoes);
        return card as HTMLDivElement;
    }

    private respostasParaTabela(respostas: RespostaPerguntaCadastro[]): HTMLTableElement {
        const tabelaRespostas = UtilDOM.criaComClasses('table', [classes.tabelaRespostas]);
        const tbody = UtilDOM.cria('tbody');

        const thead = UtilDOM.cria('thead');
        const tr = UtilDOM.cria('tr');

        const thDescricao = UtilDOM.criaComTextoEClasses('th', 'Resposta', [classes.tituloDescricaoResposta]);
        const thCorreta = UtilDOM.criaComTextoEClasses('th', 'Correta', [classes.tituloRespostaCorreta]);

        tr.appendChild(thDescricao);
        tr.appendChild(thCorreta);

        thead.appendChild(tr);

        tbody.append(
            ...respostas.map(a => this.respostaParaTR(a))
        );

        tabelaRespostas.append(thead, tbody);
        return tabelaRespostas as HTMLTableElement;
    }

    private respostaParaTR(resposta: RespostaPerguntaCadastro) {
        const trResposta = UtilDOM.criaComClasses('tr', [classes.linhaResposta]);

        const tdDescricaoResposta = UtilDOM.criaComTextoEClasses('td', resposta.descricao, [classes.descricaoResposta]);
        const tdRespostaCorreta = UtilDOM.criaComTextoEClasses('td', resposta.ehCorreta ? '✅' : '❌', [classes.respostaCorreta]);

        trResposta.append(tdDescricaoResposta, tdRespostaCorreta);

        return trResposta;
    }

    private alternarVisibilidadeRespostas(event: Event) {
        event.stopPropagation();

        const card = (event.target as HTMLElement).closest(classesCss.pergunta);

        const botao = card!.querySelector(classesCss.botaoExibirRespostas);
        const secaoRespostas = card?.querySelector(classesCss.containerRespostas);
        secaoRespostas!.toggleAttribute('hidden');

        botao!.textContent = (botao!.textContent == 'exibir respostas') ? 'recolher respostas' : 'exibir respostas';
    }
}