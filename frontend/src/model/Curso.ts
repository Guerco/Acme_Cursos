import { Assunto } from "./Assunto.ts";
import { Professor } from "./Professor.ts";

export class Curso {
    constructor (
        public readonly id: number,
        public readonly descricao: string,
        public readonly caminhoImg: string,
        public readonly professor: Professor,
        public readonly assuntos: Array<Assunto>
    ){}
}