import { NaoAutorizadoException } from "../model/exception/NaoAutorizadoException";
import { RepositorioCursosApi } from "../model/repositorio/RepositorioCursosApi";
import { ServicoCurso } from "../model/servico/ServicoListagemCursos";
import { VisaoQtdAlunosPorCurso } from "../view/VisaoQtdAlunosPorCurso";


export class ControladoraQtdAlunoPorCurso {
    private servico: ServicoCurso;

    constructor(
        private visao: VisaoQtdAlunosPorCurso
    ) {
        const repositorio = new RepositorioCursosApi();
        this.servico = new ServicoCurso(repositorio);
    }

    async listarNumeroDeAlunosPorCurso() {
        try {
            const dados = await this.servico.buscarNumeroDeAlunosPorCurso();

            this.visao.exibirGrafico(dados, 'pie');
        } catch(err : any) {
            if (err instanceof NaoAutorizadoException) {
                this.visao.redirecionaParaErro('Página não encontrada ❌');
            }
            throw err;
        }
    }

    async alternarTipoGrafico(e: Event) {
        const tipoSelecionado = (e.target as HTMLSelectElement).value;

        const dados = await this.servico.buscarNumeroDeAlunosPorCurso();

        if (tipoSelecionado == 'pizza')
            this.visao.exibirGrafico(dados, 'pie');
        else if (tipoSelecionado == 'barras')
            this.visao.exibirGrafico(dados, 'bar');
        else if (tipoSelecionado == 'rosquinha')
            this.visao.exibirGrafico(dados, 'doughnut');
    }

   
}