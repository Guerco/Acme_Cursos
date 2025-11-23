import { VisaoListagemUsuario } from "../view/VisaoListagemUsuario";
import { ServicoUsuario } from "../model/servico/ServicoUsuario";
import { RepositorioCredenciaisApi } from "../model/repositorio/RepositorioCredenciaisApi";
import { NaoAutorizadoException } from "../model/exception/NaoAutorizadoException";

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
                    if (err instanceof NaoAutorizadoException) {
                        this.visao.redirecionaParaErro('Página não encontrada ❌');
                    }
                    throw err;
                }
            }
        )();
    }

    async filtrarCargo(event : Event) {
        const select = event.target as HTMLSelectElement;
        const tipo = select.value;

        const usuarios = await this.servico.filtrarListaCargo(tipo); 
        this.visao.exibirUsuarios(usuarios);
    }
    
    async buscar() {
        try{
            const texto = this.visao.buscarTextoBusca();

            const usuarios = await this.servico.buscarPorNome(texto); 

            this.visao.exibirUsuarios(usuarios);
        } catch(err : any) {
            if (err instanceof NaoAutorizadoException) {
                    this.visao.redirecionaParaErro('Página não encontrada ❌');
                }
            throw err;
        }  
    }

}