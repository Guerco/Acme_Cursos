import { DominioException } from "../model/exception/DominioException";
import { RepositorioLoginAPI } from "../model/repositorio/RepositorioLoginAPI";
import { ServicoLogin } from "../model/servico/ServicoLogin";
import { Sessao } from "../model/sessao/Sessao";
import { rotasPaginas } from "../rotas";
import { ELEMENTOS_MENU } from "../scripts/elementos/itens-menu";
import { VisaoCabecalho } from "../view/VisaoCabecalho";


export class ControladoraCabecalho{
    private servico : ServicoLogin;

    constructor(
        private visao : VisaoCabecalho,
        sessao: Sessao
    ){
        const repositorio = new RepositorioLoginAPI();
        this.servico = new ServicoLogin(repositorio, sessao);
    }

    exibirCabecalho() {
        this.visao.montarCabecalho(ELEMENTOS_MENU);
    }

    async entrar() {
        try {
            const credenciais = this.visao.buscarCredenciais();
    
            await this.servico.login(credenciais);
            location.reload();
        } catch (err: any) {
            if (err instanceof DominioException) 
                this.visao.exibirMensagemLogin(err.message);
            else 
                throw new Error('Não foi possível entrar.');
        }
    }

    async sair() {
        try {
            await this.servico.logout();
            window.location.href = rotasPaginas.listagemCursos;
        } catch (err: any) {
            throw new Error('Não foi possível sair.');
        }
    }
}