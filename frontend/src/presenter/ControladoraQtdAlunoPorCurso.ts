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
        const dados = await this.servico.buscarNumeroDeAlunosPorCurso();

        this.visao.exibirGrafico(dados);
    }
   
}