import { RespositorioAlunos } from "../repositorio/RepositorioAlunos";

export class ServicoQuizAleatorio {

    constructor(
        private repositorioAlunos: RespositorioAlunos
    ){}

    async buscarQuizAleatorio(): Promise<number>{
        return await this.repositorioAlunos.buscarQuizAleatorio();
    }
}