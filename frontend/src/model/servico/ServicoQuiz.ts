import { RespositorioAlunos } from "../repositorio/RepositorioAlunos";
import { RepositorioPerguntas } from "../repositorio/RepositorioPerguntas";
import { PontuacoesAluno } from "../dto/PontuacoesAluno";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";
import { PerguntaListagemQuiz } from "../dto/PerguntaListagemQuiz";

export class ServicoQuiz {

    constructor(
        private repositorioAlunos: RespositorioAlunos,
        private repositorioPerguntas: RepositorioPerguntas
    ){}

    async buscarPontuacoes(idAssunto: number): Promise<PontuacoesAluno>{
        return await this.repositorioAlunos.buscarPontuacoesAluno(idAssunto);
    }

    async buscarPerguntas(idAssunto: number): Promise<PerguntaListagemQuiz[]>{
        return await this.repositorioPerguntas.buscarPerguntas(idAssunto);
    }

    async enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean>{
        return await this.repositorioAlunos.enviarResposta(respostaAluno);
    }
}