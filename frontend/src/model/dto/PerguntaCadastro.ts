import { RespostaPerguntaCadastro } from "./RespostaPerguntaCadastro";

export class PerguntaCadastro {
    constructor(
        public readonly idAssunto: number,
        public readonly descricao: string,
        public readonly dificuldade: string,
        public readonly tempoSeg: number,
        public readonly respostas: RespostaPerguntaCadastro[],
        public readonly figuraBase64: string|null = null
    ) { }
}