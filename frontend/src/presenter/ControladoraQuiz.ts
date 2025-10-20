import { VisaoQuiz } from "../view/VisaoQuiz";
import { ServicoQuiz } from "../model/servico/ServicoQuiz";
import { RepositorioAlunosAPI } from "../model/repositorio/RepositorioAlunosApi";

export class ControladoraQuiz{
    private servico: ServicoQuiz;

    constructor(
        private visao: VisaoQuiz
    ){
        const repositorio = new RepositorioAlunosAPI();
        this.servico = new ServicoQuiz(repositorio);
    }
   
    
    async verificarCredenciais(){
        try{
            const credenciais = this.visao.buscarCredenciais();
            const aluno = await this.servico.autenticar(credenciais);
            this.visao.fecharFormCredenciais(aluno);
        } catch(err : any) {
            this.visao.exibirMensagemCredenciais(err.message);
        }
    }

    redirecionarParaCursos() {
        this.visao.irParaPaginaCursos();
    }
}