import { ProfessorListagem } from "../dto/ProfessorListagem";

export interface RepositorioProfessores {
    buscarTodos() : Promise<ProfessorListagem[]>;
}