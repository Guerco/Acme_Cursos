import { ServicoUsuario } from "../model/servico/ServicoUsuario";
import { RepositorioCredenciaisApi } from "../model/repositorio/RepositorioCredenciaisApi";
import { UsuarioCadastro } from "../model/dto/UsuarioCadastro";
import { VisaoCadastroUsuario } from "../view/VisaoCadastroUsuario";

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
                    this.visao.exibirMensagem(err.message);
                }
            }
        )();
    }
}