import { RespositorioAlunos } from "../repositorio/RepositorioAlunos";
import { RepositorioPerguntas } from "../repositorio/RepositorioPerguntas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { AlunoListagem } from "../dto/AlunoListagem";
import { Credenciais } from "../dto/Credenciais";

export class ServicoQuiz {

    constructor(
        private repositorioAlunos: RespositorioAlunos,
        private repositorioPerguntas: RepositorioPerguntas
    ){}

    async autenticar(credenciais: Credenciais): Promise<AlunoListagem>{
        if(!credenciais.email || !credenciais.senha){
            throw new Error("Preencha todos os campos!");
        }
        return await this.repositorioAlunos.verificarCredenciais(credenciais);
    }

    async buscarPerguntas(idAluno: number, idAssunto: number): Promise<PerguntaListagem[]>{
        try{
            return await this.repositorioPerguntas.buscarPerguntas(idAluno, idAssunto);
        } catch(error:any){
            throw new Error(error.message);
        }
    }

}