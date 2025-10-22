import { Credenciais } from "./Credenciais";

export class RespostaAlunoCadastro{
    constructor (
        public readonly credenciaisAluno: Credenciais,
        public readonly idPergunta: number,
        public readonly idsRespostas: number[]
    ){}
}