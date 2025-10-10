import { AssuntoListagem } from "./AssuntoListagem.ts";

export class CursoListagem {
    constructor (
        public readonly id: number,
        public readonly descricao: string,
        public readonly caminhoImg: string,
        public readonly nomeProfessor: string,
        public readonly assuntos: Array<AssuntoListagem>
    ){}
}