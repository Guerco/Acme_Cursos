import { VisaoQuiz } from "../view/VisaoQuiz";
import { ServicoQuiz } from "../model/servico/ServicoQuiz";
import { RepositorioAlunosAPI } from "../model/repositorio/RepositorioAlunosApi";
import { RepositorioPerguntasApi } from "../model/repositorio/RepositorioPerguntasApi";
import { AlunoListagem } from "../model/dto/AlunoListagem";
import { PerguntaListagem } from "../model/dto/PerguntaListagem";
import { RespostaAlunoCadastro } from "../model/dto/RespostaAlunoCadastro";

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

        if(perguntas.length === 0){
            this.visao.exibirMensagemFim('Não há perguntas restantes para esse assunto');
        } else{
            const pontuacaoCurso = await this.buscarPontuacaoCurso(aluno.id, parametrosUrl.idCurso);
            this.visao.carregarPerguntas(perguntas);
            this.visao.iniciarQuiz(aluno, pontuacaoCurso);
        }   
    }

    async responder(tempoEsgotado: boolean) {
        this.visao.limparContagem(); 
        this.visao.desabilitarRespostas();

        const resposta = this.visao.buscarDadosResposta(this.visao.buscarCredenciais());

        const acertou = await this.servico.enviarResposta(resposta);

        this.visao.exibirMensagemAcertou(acertou, tempoEsgotado);

        this.visao.tornarAcaoProximaPergunta();
    }

    proximaPergunta() {
        this.visao.limparContagem();
        this.visao.exibirProximaPergunta();
    }

    private async buscarPerguntas(idAluno: number, idAssunto: number) : Promise<PerguntaListagem[]> {
        try{
            return await this.servico.buscarPerguntas(idAluno, idAssunto);
        } catch( err: any){
            throw err;
        }
    }

    async enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean> {
        try{
            return await this.servico.enviarResposta(respostaAluno);
        } catch( err: any){
            throw err;
        }
    }

    async buscarPontuacaoCurso(idAluno: number, idCurso: number): Promise<number>{
        try{
            return await this.servico.buscarPontuacaoCurso(idAluno, idCurso);
        } catch( err: any){
            throw err;
        }
    }
}