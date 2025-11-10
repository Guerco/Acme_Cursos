import { VisaoListagemPerguntas } from "../view/VisaoListagemPerguntas";
import { ServicoListagemPerguntas } from "../model/servico/ServicoListagemPerguntas";
import { RepositorioPerguntasJsonServer } from "../model/repositorio/RepositorioPerguntasJsonServer";

export class ControladoraListagemPerguntas {
    private servico: ServicoListagemPerguntas;

    constructor(
        private visao: VisaoListagemPerguntas
    ) {
        const repositorio = new RepositorioPerguntasJsonServer();
        this.servico = new ServicoListagemPerguntas(repositorio);
    }

    async listarPerguntas() {
        try {
            const perguntas = await this.servico.buscarTodos();
            this.visao.exibirPerguntas(perguntas);
        } catch (err: any) {
            throw err;
        }
    }
}