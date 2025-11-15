import { VisaoListagemUsuario } from "../view/VisaoListagemUsuario";
import { ServicoUsuario } from "../model/servico/ServicoUsuario";
import { RepositorioCredenciaisApi } from "../model/repositorio/RepositorioCredenciaisApi";

export class ControladoraListagemUsuarios{
    private servico : ServicoUsuario;

    constructor(
        private visao : VisaoListagemUsuario
    ){
        const repositorio = new RepositorioCredenciaisApi();
        this.servico = new ServicoUsuario(repositorio);
    }

    listarUsuarios() {
        ( async () => {
                try {
                    const usuarios = await this.servico.listarTodos(); 
                    this.visao.exibirUsuarios(usuarios);
                } catch(err : any) {
                    this.visao.exibirMensagem(err.message);
                }
            }
        )();
    }

}