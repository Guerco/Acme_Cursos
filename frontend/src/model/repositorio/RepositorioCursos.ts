import { Curso } from '../Curso.ts';

export interface RepositorioCursos {
    buscarTodos() : Promise<Curso[]>;
    buscarPorDescricaoOuProfessor(filtro : string) : Promise<Curso[]>;
}

