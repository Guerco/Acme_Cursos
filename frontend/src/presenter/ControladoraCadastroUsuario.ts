import { ServicoUsuario } from "../model/servico/ServicoUsuario";
import { RepositorioCredenciaisApi } from "../model/repositorio/RepositorioCredenciaisApi";
import { UsuarioCadastro } from "../model/dto/UsuarioCadastro";
import { VisaoCadastroUsuario } from "../view/VisaoCadastroUsuario";
import { DominioException } from "../model/exception/DominioException";
import { NaoAutorizadoException } from "../model/exception/NaoAutorizadoException";

export class ControladoraCadastroUsuario{
    private servico : ServicoUsuario;

    constructor(
        private visao : VisaoCadastroUsuario
    ){
        const repositorio = new RepositorioCredenciaisApi();
        this.servico = new ServicoUsuario(repositorio);
    }

    cadastrarUsuario() {
        ( async () => {
                try {
                    const usuario = this.visao.buscaDadosUsuario();
                    await this.servico.cadastrarUsuario(usuario);
                    this.visao.exibirMensagemSucesso();
                } catch(err : any) {
                    if (err instanceof NaoAutorizadoException) {
                        this.visao.redirecionaParaErro('Página não encontrada ❌');
                    }
                    if (err instanceof DominioException) {
                        this.visao.exibirMensagem(err.getProblemas());
                    } else throw err;
                }
            }
        )();
    }
}