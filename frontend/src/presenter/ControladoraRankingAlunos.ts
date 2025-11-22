import { AlunoRel } from "../model/dto/relatorio/AlunoRel";
import { RepositorioAlunosAPI } from "../model/repositorio/RepositorioAlunosApi";
import { RepositorioAlunosJSON } from "../model/repositorio/RepositorioAlunosJSON";
import { ServicoRankingAlunos } from "../model/servico/ServicoRankingAlunos";
import { VisaoRankingAlunos } from "../view/VisaoRankingAlunos";


export class ControladoraRankingAlunos {
    private servico: ServicoRankingAlunos;

    constructor(
        private visao: VisaoRankingAlunos
    ) {
        const repositorio = new RepositorioAlunosAPI();
        this.servico = new ServicoRankingAlunos(repositorio);
    }

    async listarAlunosPontuacaoGeral() {
        const ranking = await this.servico.buscarRankingAlunos("");

        this.visao.preencherTabela(ranking);
    }

    async listarAlunosPontuacaoCurso() {
        const ranking = await this.servico.buscarRankingAlunosCurso("");

        this.visao.preencherTabela(ranking);
    }

    async alternarRanking(event : Event) {
        const select = event.target as HTMLSelectElement;
        const tipo = select.value;

        switch (tipo) {
            case 'pontuacao-geral':
                this.listarAlunosPontuacaoGeral();
                this.visao.alterarCaptionBusca('Buscar aluno');
                break;
            case 'pontuacao-curso':
                this.listarAlunosPontuacaoCurso();
                this.visao.alterarCaptionBusca('Buscar aluno ou curso');
            break;
        }
    }

    async buscar() {
        const texto = this.visao.buscarTextoBusca();

        const tipoRanking = this.visao.buscarTipoRanking();

        let ranking = [] as AlunoRel[];
        switch (tipoRanking) {
            case 'pontuacao-geral':
                ranking = await this.servico.buscarRankingAlunos(texto);
                break;
            case 'pontuacao-curso':
                ranking = await this.servico.buscarRankingAlunosCurso(texto);
                break;
        }


        this.visao.preencherTabela(ranking);
    }
}