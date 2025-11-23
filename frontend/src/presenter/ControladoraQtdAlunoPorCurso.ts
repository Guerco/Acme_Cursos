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

            this.visao.exibirGrafico(dados);
        } catch(err : any) {
            if (err instanceof NaoAutorizadoException) {
                this.visao.redirecionaParaErro('Página não encontrada ❌');
            }
            throw err;
        }
        
    }
   
}