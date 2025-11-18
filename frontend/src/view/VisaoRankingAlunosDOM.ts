import { ControladoraRankingAlunos } from "../presenter/ControladoraRankingAlunos.ts";
import { classes, ids } from "../ui/ranking-alunos-ui.ts";
import { VisaoRankingAlunos } from "./VisaoRankingAlunos.ts";
import { AlunoRel } from "../model/dto/relatorio/AlunoRel.ts";
import { UtilDOM } from "../util/UtilDOM.ts";
import { AlunoCursoRel } from "../model/dto/relatorio/AlunoCursoRel.ts";

export class VisaoRankingAlunosDOM implements VisaoRankingAlunos {
    private controladora: ControladoraRankingAlunos;
    private tabela! : HTMLTableElement;
    private selectRanking! : HTMLSelectElement;
    private busca! : HTMLFormElement;
    private inputBusca! : HTMLInputElement;

    
    constructor() {
        this.controladora = new ControladoraRankingAlunos(this);
    }
    
    public iniciar() {
        this.carregarElementos();

        this.controladora.listarAlunosPontuacaoGeral();

        this.selectRanking.addEventListener('change', (e) => {
            this.controladora.alternarRanking(e);
        });

        this.busca.addEventListener('submit', (e) => {
            e.preventDefault();
            this.controladora.buscar();
        });
    }

    // Métodos de Entrada
    public buscarTextoBusca () : string {
        return this.inputBusca.value;
    }

    public buscarTipoRanking () : string {
        return this.selectRanking.value;
    }

    // Métodos de Saída
    public preencherTabela(ranking: AlunoRel[]|AlunoCursoRel[]) {
        this.tabela.innerHTML= '';
        this.tabela.appendChild(this.criarCabecalhoRanking())

        this.tabela.appendChild(
             this.rankingParaTbody(ranking as AlunoRel[])
         );
    }
    
    public alterarCaptionBusca (texto : string) : void {
        this.inputBusca.placeholder = texto;
    }
    // Métodos Auxiliares
    private carregarElementos() {
        this.tabela = document.getElementById(ids.tabelaRel) as HTMLTableElement;
        this.selectRanking = document.getElementById(ids.selectRanking) as HTMLSelectElement;
        this.busca = document.getElementById(ids.busca) as HTMLFormElement;
        this.inputBusca = document.getElementById(ids.inputBusca) as HTMLInputElement;
    }

    private criarCabecalhoRanking() {
        const thead = UtilDOM.cria('thead');
        const tr = UtilDOM.cria('tr') as HTMLTableRowElement;

        const thPosicao = UtilDOM.criaComTexto('th', '#')
        const thNome = UtilDOM.criaComTexto('th', '👤 Aluno')
        const thPontuacao = UtilDOM.criaComTexto('th', '⭐ Pontos');

        tr.append(thPosicao, thNome, thPontuacao);
        thead.appendChild(tr);

        return thead;
    }

    private rankingParaTbody(ranking: AlunoCursoRel[]|AlunoRel[]): HTMLTableSectionElement {
        const tbody = UtilDOM.cria('tbody') as HTMLTableSectionElement;
        let curso = '';

        if (ranking.length === 0) {
            const trMensagem = UtilDOM.criaComClasses('tr', [classes.mensagem]);
            const tdMensagem = UtilDOM.criaComTextoEClasses('td','Não há alunos para se listar', [classes.mensagem]) as HTMLTableCellElement;
            tdMensagem.colSpan = 3;
            trMensagem.appendChild(tdMensagem);
            tbody.appendChild(trMensagem);
            return tbody;
        }
        for (const a of ranking) {
            if (a instanceof AlunoCursoRel) {
                if (curso != a.nomeCurso) {
                    curso = a.nomeCurso;
    
                    const trCurso = UtilDOM.criaComClasses('tr', [classes.trCurso]);
                    const tdCurso = UtilDOM.criaComTexto('td', curso) as HTMLTableCellElement;
                    tdCurso.colSpan = 3;
    
                    trCurso.appendChild(tdCurso);
                    tbody.appendChild(trCurso);
                }
            }

            tbody.appendChild(this.alunoParaTR(a));
        }

        return tbody;
    }

    private alunoParaTR(aluno: AlunoRel|AlunoCursoRel) : HTMLTableRowElement {
        const tr = UtilDOM.criaComClasses('tr', [classes.trAluno]) as HTMLTableRowElement;
        
        const tdPosicao = UtilDOM.criaComTexto('td', aluno.posicao.toString())
        const tdNome = UtilDOM.criaComTexto('td', aluno.nome)
        const tdPontuacao = UtilDOM.criaComTexto('td', aluno.pontuacao.toString());

        tr.append(tdPosicao, tdNome, tdPontuacao);
        return tr;
    }
  
}