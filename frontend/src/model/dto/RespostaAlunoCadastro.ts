export class RespostaAlunoCadastro{
    constructor (
        public readonly idPergunta: number,
        public readonly idsRespostas: number[]
    ){}
}