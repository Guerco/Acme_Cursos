import { RespositorioAlunos } from "../repositorio/RepositorioAlunos";
import { RepositorioPerguntas } from "../repositorio/RepositorioPerguntas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { AlunoListagem } from "../dto/AlunoListagem";
import { Credenciais } from "../dto/Credenciais";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";

export class ServicoQuiz {

    constructor(
        private repositorioAlunos: RespositorioAlunos,
        private repositorioPerguntas: RepositorioPerguntas
    ){}

    async autenticar(credenciais: Credenciais): Promise<AlunoListagem>{
        if(!credenciais.email || !credenciais.senha){
            throw new Error("Preencha todos os campos!");
        }
        try {
            return await this.repositorioAlunos.verificarCredenciais(credenciais);
        } catch (error) {
            throw error;
        }
    }

    async buscarPerguntas(idAluno: number, idAssunto: number): Promise<PerguntaListagem[]>{
        try{
            return await this.repositorioPerguntas.buscarPerguntas(idAluno, idAssunto);
        } catch(error:any){
            throw error;
        }
    }

    async enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean>{
        try{
            return await this.repositorioAlunos.enviarResposta(respostaAluno);
        }catch(error:any){
            throw new Error(error.message);
        }
    }

    async buscarPontuacaoCurso(idAluno: number, idCurso: number): Promise<number> {
        try{
            return await this.repositorioAlunos.buscarPontuacaoAlunoCurso(idAluno, idCurso);
        }catch(error:any){
            throw error;
        }
    }

}