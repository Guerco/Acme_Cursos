import { DominioException } from "../model/exception/DominioException";
import { RepositorioLoginAPI } from "../model/repositorio/RepositorioLoginAPI";
import { RepositorioAlunosAPI } from "../model/repositorio/RepositorioAlunosApi.ts";
import { ServicoLogin } from "../model/servico/ServicoLogin";
import { ServicoQuizAleatorio } from "../model/servico/ServicoQuizAleatorio";
import { Sessao } from "../model/sessao/Sessao";
import { rotasPaginas } from "../rotas";
import { ELEMENTOS_MENU } from "../scripts/elementos/itens-menu";
import { VisaoCabecalho } from "../view/VisaoCabecalho";


export class ControladoraCabecalho{
    private servicoLogin : ServicoLogin;
    private servicoQuizAleatorio : ServicoQuizAleatorio;

    constructor(
        private visao : VisaoCabecalho,
        sessao: Sessao
    ){
        const repositorio = new RepositorioLoginAPI();
        const repositorioAlunos = new RepositorioAlunosAPI();

        this.servicoLogin = new ServicoLogin(repositorio, sessao);
        this.servicoQuizAleatorio = new ServicoQuizAleatorio(repositorioAlunos);
    }

    exibirCabecalho() {
        this.visao.montarCabecalho(ELEMENTOS_MENU);
    }

    async entrar() {
        try {
            const credenciais = this.visao.buscarCredenciais();
    
            await this.servicoLogin.login(credenciais);
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
            await this.servicoLogin.logout();
            window.location.href = rotasPaginas.listagemCursos;
        } catch (err: any) {
            throw new Error('Não foi possível sair.');
        }
    }

    async quizAleatorio() {
        const idAssunto = await this.servicoQuizAleatorio.buscarQuizAleatorio();
        if (idAssunto == false)
            this.visao.exibirAlert('Ops, não há nenhum quiz a ser iniciado!');
        else
            this.visao.redirecionarQuiz(idAssunto as number);
    }
}