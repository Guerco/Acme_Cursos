import { Assunto } from "../model/Assunto.ts";
import { Curso } from "../model/Curso.ts";
import { ControladoraListagemCursos } from "../presenter/ControladoraListagemCursos.ts";
import { classes, ids } from "../ui/listagem-cursos-ui.ts";
import { UtilDOM } from "../util/UtilDOM.ts";
import { VisaoListagemCursos } from "./VisaoListagemCursos.ts";

const DIRETORIO_IMAGENS = '../../img/';

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

    exibirCursos (cursos: Curso[]): void {
        this.limparCorpo();
        
        if (!cursos || cursos.length === 0) {
            this.exibirMensagem('Não há cursos para se listar.');
        } else {
            const secaoCursos = this.buscarSecaoCursos();
            
            const cursosOrdenados = this.ordenarCursos(cursos); 
            
            const cardsCursos = this.cursosParaCards(cursosOrdenados);
    
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

    private ordenarCursos (cursos : Curso[]) {
        return cursos.sort((c1 : Curso, c2: Curso) => {
            return (c1.descricao > c2.descricao) ? 1 : -1;
        });
    }

    private cursosParaCards(cursos: Curso[]): HTMLDivElement[] {
        if (!cursos || cursos.length === 0) {
            return [UtilDOM.criaComTexto('h3', 'Não há cursos para se listar.') as HTMLDivElement];
        }

        
        return cursos.map(a => this.cursoParaCard(a));
    }

    private cursoParaCard(curso: Curso) : HTMLDivElement {
        const card = UtilDOM.criaComClasses('div', [classes.curso]);
        card.dataset.id = curso.id.toString();
        card.addEventListener('click', this.alternarVisibilidadeAssuntos);

        const secaoCurso = UtilDOM.criaComClasses('div', [classes.secaoCurso]);

        const elementoFigura = UtilDOM.cria('figure');
        elementoFigura.appendChild(UtilDOM.criaImg(DIRETORIO_IMAGENS+curso.caminhoImg));
    
        const secaoCursoLateral = UtilDOM.criaComClasses('div', [classes.secaoCursoLat]);
        const infoCurso = UtilDOM.criaComClasses('div', [classes.infoCurso]);
        infoCurso.appendChild(UtilDOM.criaComTextoEClasses('h2', curso.descricao, [classes.descricaoCurso]));
        infoCurso.appendChild(UtilDOM.criaComTextoEClasses('p', curso.professor.nome, [classes.nomeProfessor]));
        secaoCursoLateral.appendChild(infoCurso);
    
        secaoCurso.append(elementoFigura, secaoCursoLateral);

        const secaoAssuntos = UtilDOM.criaComClasses('div', [classes.assuntos]);
        secaoAssuntos.hidden = true;
        const tabelaAssuntos = this.assuntosParaTabela(curso.assuntos);
        secaoAssuntos.appendChild(tabelaAssuntos);
    
        const cursoAcoes = UtilDOM.criaComClasses('div', [classes.acoesCurso]);
        const botaoExibirAssuntos = UtilDOM.criaComTextoEClasses('button', 'exibir assuntos', [classes.botaoAssuntos]);
        botaoExibirAssuntos.addEventListener('click', this.alternarVisibilidadeAssuntos);
        cursoAcoes.appendChild(botaoExibirAssuntos);
    
        card.append(secaoCurso, secaoAssuntos, cursoAcoes);

        return card as HTMLDivElement;
    }

    private assuntosParaTabela(assuntos: Assunto[]): HTMLTableElement {
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

    private assuntoParaTR(assunto: Assunto){
        const trAssunto = UtilDOM.criaComClasses('tr', [classes.linhaAssunto]);
        trAssunto.dataset.id = assunto.id.toString();

        const tdDescricao = UtilDOM.criaComTexto('td', assunto.descricao);
        
        trAssunto.appendChild(tdDescricao);
        
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
}