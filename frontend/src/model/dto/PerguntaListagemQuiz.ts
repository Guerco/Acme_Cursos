import { RespostaPerguntaListagem } from "./RespostaPerguntaListagem";

export class PerguntaListagemQuiz{
        constructor (
                public readonly id: number,
                public readonly descricao: string,
                public readonly caminhoImg: string,
                public readonly tempoSeg : number,
                public readonly dificuldade: string,
                public readonly respostas: Array<RespostaPerguntaListagem>
        ){}
}