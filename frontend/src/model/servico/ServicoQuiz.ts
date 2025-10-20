import { RespositorioAlunos } from "../repositorio/RepositorioAlunos";
import { AlunoListagem } from "../dto/AlunoListagem";
import { Credenciais } from "../dto/Credenciais";

export class ServicoQuiz {

    constructor(private repositorio: RespositorioAlunos){
    }

    async autenticar(credenciais: Credenciais): Promise<AlunoListagem>{
        if(!credenciais.email || !credenciais.senha){
            throw new Error("Preencha todos os campos!");
        }

        return await this.repositorio.verificarCredenciais(credenciais);
    }

}