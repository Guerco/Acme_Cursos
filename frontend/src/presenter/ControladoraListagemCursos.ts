import { RepositorioCursosApi } from "../model/repositorio/RepositorioCursosApi";
import { ServicoCurso } from "../model/servico/ServicoListagemCursos";
import { VisaoListagemCursos } from "../view/VisaoListagemCursos";

export class ControladoraListagemCursos {
    private servico : ServicoCurso;

    constructor(
        private visao: VisaoListagemCursos
    ){
        const repositorio = new RepositorioCursosApi();
        this.servico = new ServicoCurso(repositorio);
    }
    
    listarCursos() {
        ( async () => {
                try {
                    const cursos = await this.servico.buscarTodos(); 
                    this.visao.exibirCursos(cursos);
                } catch(err : any) {
                    this.visao.exibirMensagem(err.message);
                }
            }
        )();
    }

    buscarCursos() {
        (
            async () => {
                try {
                    const filtro = this.visao.obterFiltroBusca();
                    const cursosFiltrados = await this.servico.buscarFiltrados(filtro);
                    this.visao.exibirCursos(cursosFiltrados);
                } catch(err : any) {
                    this.visao.exibirMensagem(err.message);
                }
            }
        )
        ();
    }
}