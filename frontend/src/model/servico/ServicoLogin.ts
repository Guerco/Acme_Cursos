import { Credenciais } from "../dto/Credenciais";
import { RepositorioLogin } from "../repositorio/RepositorioLogin";
import { Sessao } from "../sessao/Sessao";


export class ServicoLogin{
    constructor(
        private repositorio : RepositorioLogin,
        private sessao : Sessao
    ){}

    async login(credenciais: Credenciais) : Promise<void> {
        const usuario = await this.repositorio.entrar(credenciais);

        this.sessao.iniciarSessao(usuario);
    }

    async logout() : Promise<void> {
        this.repositorio.sair();

        this.sessao.encerrarSessao();
    }
}