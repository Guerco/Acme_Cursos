import { AssuntoListagem } from "../model/dto/AssuntoListagem.ts";
import { CursoListagem } from "../model/dto/CursoListagem.ts";
import { ControladoraListagemCursos } from "../presenter/ControladoraListagemCursos.ts";
import { classes, ids } from "../ui/listagem-cursos-ui.ts";
import { UtilDOM } from "../util/UtilDOM.ts";
import { VisaoListagemCursos } from "./VisaoListagemCursos.ts";
import { rotasPaginas } from "../rotas.ts";

const DIRETORIO_IMAGENS = '../../img/cursos/';

export class VisaoListagemCursosDom implements VisaoListagemCursos{
    private controladora: ControladoraListagemCursos;
    
    constructor() {
        this.controladora = new ControladoraListagemCursos(this);
    }

    iniciar() {
        this.controladora.listarCursos();

        document.getElementById(ids.formBusca.slice(1))!.addEventListener('submit', (event) => {
            event.preventDefault();
            this.controladora.buscarCursos();
        });
    }

    // Métodos de Entrada
    obterFiltroBusca() : string {
        return (document.getElementById(ids.busca.slice(1))! as HTMLInputElement).value;
    }

    // Métodos de Saída
    exibirMensagem (mensagem : string) : void {
        this.limparCorpo();
        const outMensagem = document.getElementById(ids.mensagem.slice(1));
        outMensagem!.innerText = mensagem;
    }

    exibirCursos (cursos: CursoListagem[]): void {
        this.limparCorpo();
        
        if (!cursos || cursos.length === 0) {
            this.exibirMensagem('Não há cursos para se listar.');
        } else {
            const secaoCursos = this.buscarSecaoCursos();
            
            const cardsCursos = this.cursosParaCards(cursos);
    
            const frag = UtilDOM.criaFragmentoComElementos(cardsCursos);
    
            secaoCursos?.appendChild(frag);
        }
    }
    
    // Métodos Auxiliares
    private limparCursos() : void{
        const secaoCursos = this.buscarSecaoCursos();
        secaoCursos!.innerHTML = '';
    }

    private limparMensagem() : void{
        const outMensagem = document.getElementById(ids.mensagem.slice(1));
        outMensagem!.innerText = '';
    }

    private limparCorpo() : void {
        this.limparCursos();
        this.limparMensagem();
    }

    private buscarSecaoCursos() : HTMLElement {
        return document.getElementById(ids.secaoCursos.slice(1))!;
    }

    private cursosParaCards(cursos: CursoListagem[]): HTMLDivElement[] {
        if (!cursos || cursos.length === 0) {
            return [UtilDOM.criaComTexto('h3', 'Não há cursos para se listar.') as HTMLDivElement];
        }

        
        return cursos.map(a => this.cursoParaCard(a));
    }

    private cursoParaCard(curso: CursoListagem) : HTMLDivElement {
        const card = UtilDOM.criaComClasses('div', [classes.curso]);
        card.dataset.id = curso.id.toString();
        card.addEventListener('click', this.alternarVisibilidadeAssuntos);

        const containerCurso = UtilDOM.criaComClasses('div', [classes.containerCurso]);

        const figuraCurso = UtilDOM.criaImg(DIRETORIO_IMAGENS+curso.caminhoImg);
    
        const infoCurso = UtilDOM.criaComClasses('div', [classes.infoCurso]);
        infoCurso.appendChild(UtilDOM.criaComTextoEClasses('h2', curso.descricao, [classes.descricaoCurso]));
        infoCurso.appendChild(UtilDOM.criaComTextoEClasses('p', curso.nomeProfessor, [classes.nomeProfessor]));
    
        containerCurso.append(figuraCurso, infoCurso);

        const containerAssuntos = UtilDOM.criaComClasses('div', [classes.assuntos]);
        containerAssuntos.hidden = true;
        const tabelaAssuntos = this.assuntosParaTabela(curso.assuntos);
        containerAssuntos.appendChild(tabelaAssuntos);
    
        const cursoAcoes = UtilDOM.criaComClasses('div', [classes.acoesCurso]);
        const botaoExibirAssuntos = UtilDOM.criaComTextoEClasses('button', 'exibir assuntos', [classes.botaoAssuntos]);
        botaoExibirAssuntos.addEventListener('click', this.alternarVisibilidadeAssuntos);
        cursoAcoes.appendChild(botaoExibirAssuntos);
    
        card.append(containerCurso, containerAssuntos, cursoAcoes);

        return card as HTMLDivElement;
    }

    private assuntosParaTabela(assuntos: AssuntoListagem[]): HTMLTableElement {
        const tabelaAssuntos = UtilDOM.criaComClasses('table', [classes.tabelaAssuntos]);
        const tbody = UtilDOM.cria('tbody');

        if (!assuntos || assuntos.length === 0) {
            tbody.append(
                this.assuntoParaTR(
                    {id:-1, descricao:'Este curso ainda não possui assuntos.'}
                )
            );
        } else {
            tbody.append(
                ...assuntos.map(a => this.assuntoParaTR(a))
            );
        }
        tabelaAssuntos.appendChild(tbody);
        return tabelaAssuntos as HTMLTableElement;
    }

    private assuntoParaTR(assunto: AssuntoListagem){
        const trAssunto = UtilDOM.criaComClasses('tr', [classes.linhaAssunto]);
        trAssunto.dataset.id = assunto.id.toString();

        const tdDescricao = UtilDOM.criaComTextoEClasses('td', assunto.descricao, [classes.descricaoAssunto]);
        
        trAssunto.appendChild(tdDescricao);
        

        const tdAcoes = UtilDOM.criaComClasses('td', ['assunto-acoes']); 
        const botaoIniciarQuiz = UtilDOM.criaComTextoEClasses('button', 'iniciar quiz 🎲', ['botao-iniciar-quiz']);
        botaoIniciarQuiz.addEventListener('click', this.redirecionarParaQuiz);
        tdAcoes.appendChild(botaoIniciarQuiz);
        trAssunto.appendChild(tdAcoes);

        return trAssunto;
    }

    private  alternarVisibilidadeAssuntos (event: Event) {
        event.stopPropagation();

        const card = (event.target as HTMLElement).closest(classes.curso);
        
        const botao = card!.querySelector(classes.botaoAssuntos);
        const secaoAssuntos = card?.querySelector(classes.assuntos);
        secaoAssuntos!.toggleAttribute('hidden');

        botao!.textContent = (botao!.textContent == 'exibir assuntos') ? 'recolher assuntos' : 'exibir assuntos';
    }

    private redirecionarParaQuiz(event: Event){
        event.stopPropagation();
        const botao = event.target as HTMLButtonElement;

        const idAssunto = (botao.closest(`.${classes.linhaAssunto}`) as HTMLTableRowElement).dataset.id;
        const idCurso = (botao.closest(classes.curso) as HTMLDivElement).dataset.id;

        window.location.href = `${rotasPaginas.quiz}?curso=${idCurso}&assunto=${idAssunto}`;
    }
}