import { VisaoQuiz } from "../view/VisaoQuiz";
import { ServicoQuiz } from "../model/servico/ServicoQuiz";
import { RepositorioAlunosAPI } from "../model/repositorio/RepositorioAlunosApi";
import { RepositorioPerguntasApi } from "../model/repositorio/RepositorioPerguntasApi";
import { AlunoListagem } from "../model/dto/AlunoListagem";
import { PerguntaListagem } from "../model/dto/PerguntaListagem";

export class ControladoraQuiz{
    private servico: ServicoQuiz;

    constructor(
        private visao: VisaoQuiz
    ){
        const repoAlunos = new RepositorioAlunosAPI();
        const repoPerguntas = new RepositorioPerguntasApi();
        this.servico = new ServicoQuiz(repoAlunos, repoPerguntas);
    }
   
    async verificarCredenciais(){
        try{
            const credenciais = this.visao.buscarCredenciais();
            const aluno = await this.servico.autenticar(credenciais);
            await this.preencherPerguntas(aluno);
            this.visao.fecharFormCredenciais();
        } catch(err : any) {
            if (err.message === 'Credenciais Inválidas.'){
                this.visao.exibirMensagemCredenciais(err.message);
            } else {
                throw new Error('Não foi possível verificar as credenciais.');
            }
        }
    }

    redirecionarParaCursos() {
        this.visao.irParaPaginaCursos();
    }

    exibirInformarCredenciais(){
        this.visao.chamarModal();
    }

    async preencherPerguntas(aluno: AlunoListagem){
        const parametrosUrl = this.visao.buscarParametrosUrl();
        const perguntas = await this.buscarPerguntas(aluno.id, parametrosUrl.idAssunto);
        this.visao.carregarPerguntas(perguntas);
    }

    private async buscarPerguntas(idAluno: number, idAssunto: number) : Promise<PerguntaListagem[]> {
        try{
            return await this.servico.buscarPerguntas(idAluno, idAssunto);
        } catch( err: any){
            throw err;
        }
    }
}