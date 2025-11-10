import { RespostaPerguntaCadastro } from "./RespostaPerguntaCadastro";

export class PerguntaListagem {
    constructor(
        public readonly descricao: string,
        public readonly caminhoImg: string|null,
        public readonly tempoSeg: number,
        public readonly dificuldade: string,
        public readonly descricaoAssunto: string,
        public readonly ultimaAtualizacao: string,
        public readonly respostas: RespostaPerguntaCadastro[]
    ) { }

}