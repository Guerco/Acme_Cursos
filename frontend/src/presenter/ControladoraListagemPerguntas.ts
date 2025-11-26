import { VisaoListagemPerguntas } from "../view/VisaoListagemPerguntas";
import { ServicoListagemPerguntas } from "../model/servico/ServicoListagemPerguntas";
import { DominioException } from "../model/exception/DominioException";
import { RepositorioPerguntasApi } from "../model/repositorio/RepositorioPerguntasApi";
import { NaoAutorizadoException } from "../model/exception/NaoAutorizadoException";

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
            
            let assunto = null
            if (perguntas.length > 0) 
                assunto = (idAssunto !== null) ? perguntas[0].descricaoAssunto : null;
            
            this.visao.exibirPerguntas(perguntas, assunto);
        } catch (err: any) {
            if (err instanceof NaoAutorizadoException) {
                this.visao.redirecionaParaErro('Página não encontrada ❌');
            }
            if (err instanceof DominioException)
                this.visao.exibirMensagem(err.getProblemas())
            throw err;
        }
    }
}