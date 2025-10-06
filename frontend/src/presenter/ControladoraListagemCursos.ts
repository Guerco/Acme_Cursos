import { ServicoCurso } from "../model/servico/ServicoListagemCursos";
import { VisaoListagemCursos } from "../view/VisaoListagemCursos";

export class ControladoraListagemCursos {
    private servico : ServicoCurso;

    constructor(
        private visao: VisaoListagemCursos
    ){
        this.servico = new ServicoCurso();
    }
    
    listarCursos() {
        ( async () => {
                try {
                    const cursos = await this.servico.buscarTodos(); 
                    this.visao.exibirCursos(cursos);
                } catch(err) {
                    this.visao.exibirMensagem((err as Error).message);
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
                } catch(err) {
                    this.visao.exibirMensagem((err as Error).message);
                }
            }
        )
        ();
    }
}