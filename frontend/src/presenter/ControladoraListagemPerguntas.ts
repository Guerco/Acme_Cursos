import { VisaoListagemPerguntas } from "../view/VisaoListagemPerguntas";
import { ServicoListagemPerguntas } from "../model/servico/ServicoListagemPerguntas";
import { DominioException } from "../model/exception/DominioException";
import { RepositorioPerguntasApi } from "../model/repositorio/RepositorioPerguntasApi";

export class ControladoraListagemPerguntas {
    private servico: ServicoListagemPerguntas;

    constructor(
        private visao: VisaoListagemPerguntas
    ) {
        const repositorio = new RepositorioPerguntasApi();
        this.servico = new ServicoListagemPerguntas(repositorio);
    }

    async listarPerguntas() {
        try {
            const idAssunto = this.visao.obterIdAssunto();
            const perguntas = await this.servico.buscarTodos(idAssunto);
            this.visao.exibirPerguntas(perguntas);
        } catch (err: any) {
            if (err instanceof DominioException)
                this.visao.exibirMensagem(err.getProblemas())
            else throw err;
        }
    }
}