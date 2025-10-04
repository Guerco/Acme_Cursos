import { Assunto } from "../model/Assunto.ts";
import { Curso } from "../model/Curso.ts";
import { ControladoraListagemCursos } from "../presenter/ControladoraListagemCursos.ts";
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
    }
    // Métodos de Entrada

    // Métodos de Saída
    exibirCursos (cursos: Curso[]): void {
        const secaoCursos = document.getElementById('sec-cursos');

        const cursosOrdenados = this.ordenarCursos(cursos); 

        const cardsCursos = this.cursosParaCards(cursosOrdenados);

        const frag = UtilDOM.criaFragmentoComElementos(cardsCursos);

        secaoCursos?.appendChild(frag);
    }

    // Métodos Auxiliares
    private ordenarCursos (cursos : Curso[]) {
        return cursos.sort((c1 : Curso, c2: Curso) => {
            return (c1.descricao > c2.descricao) ? 1 : -1;
        });
    }

    private cursosParaCards(cursos: Curso[]): HTMLDivElement[] {
        return cursos.map(a => this.cursoParaCard(a));
    }

    private cursoParaCard(curso: Curso) : HTMLDivElement {
        const card = UtilDOM.criaComClasses('div', ['card-curso']);
        card.dataset.id = curso.id.toString();

        const secaoCurso = UtilDOM.criaComClasses('div', ['secao-curso']);

        const elementoFigura = UtilDOM.cria('figure');
        elementoFigura.appendChild(UtilDOM.criaImg(DIRETORIO_IMAGENS+curso.caminhoImg));
    
        const secaoCursoLateral = UtilDOM.criaComClasses('div', ['secao-curso-lateral']);
        const infoCurso = UtilDOM.criaComClasses('div', ['info-curso']);
        infoCurso.appendChild(UtilDOM.criaComTextoEClasses('h2', curso.descricao, ['descricao-curso']));
        infoCurso.appendChild(UtilDOM.criaComTextoEClasses('p', curso.professor.nome, ['nome-professor']));
        secaoCursoLateral.appendChild(infoCurso);
    
        secaoCurso.append(elementoFigura, secaoCursoLateral);
    
        const secaoAssuntos = UtilDOM.criaComClasses('div', ['secao-assuntos']);
        const tabelaAssuntos = this.assuntosParaTabela(curso.assuntos);
        secaoAssuntos.appendChild(tabelaAssuntos);

        card.append(secaoCurso, secaoAssuntos);
    
        return card as HTMLDivElement;
    }

    private assuntosParaTabela(assuntos: Assunto[]): HTMLTableElement {
        const tabelaAssuntos = UtilDOM.criaComClasses('table', ['tabela-assuntos']);
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
        const trAssunto = UtilDOM.criaComClasses('tr', ['tr-assunto']);
        trAssunto.dataset.id = assunto.id.toString();

        const tdDescricao = UtilDOM.criaComTexto('td', assunto.descricao);
        
        trAssunto.appendChild(tdDescricao);
        
        return trAssunto;
    }
}