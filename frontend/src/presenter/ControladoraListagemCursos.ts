import { ServicoCurso } from "../model/servico/ServicoListagemCursos";
import { VisaoListagemCursos } from "../view/VisaoListagemCursos";

export class ControladoraListagemCursos {
    constructor(
        private visao: VisaoListagemCursos
    ){}

    listarCursos() {
        const servico = new ServicoCurso();
        (
            async () => {
                const cursos = await servico.buscarTodos();
                this.visao.exibirCursos(cursos);
            }
        )();
    }
}