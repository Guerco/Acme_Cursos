import { RespositorioAlunos } from "./RepositorioAlunos";
import { AlunoListagem } from "../dto/AlunoListagem";
import { Credenciais } from "../dto/Credenciais";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";
import { AlunoRel } from "../dto/relatorio/AlunoRel";
import { AlunoCursoRel } from "../dto/relatorio/AlunoCursoRel";

export class RepositorioAlunosJSON implements RespositorioAlunos {

    async verificarCredenciais(credenciais: Credenciais): Promise<AlunoListagem> {
        return new AlunoListagem(1,'nome',1);
    }

    async buscarPontuacaoAlunoCurso(idAluno: number, idCurso: number): Promise<number>{
        return 1;
    }

    async enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean>{
        return false;
    }

    async buscarRankingAlunos() : Promise<AlunoRel[]> {
        const ranking: AlunoRel[] = [
            new AlunoRel(1, "Ana Beatriz Mendes", 98.5),
            new AlunoRel(2, "Carlos Henrique Silva", 95.2),
            new AlunoRel(3, "Marcos Vinícius Duarte", 92.1),
            new AlunoRel(4, "Julia Fernandes Costa", 89.7),
            new AlunoRel(5, "Rafael Augusto Lopes", 87.4),
            new AlunoRel(6, "Beatriz Souza Almeida", 84.9),
            new AlunoRel(7, "Leonardo Martins Rocha", 81.3),
            new AlunoRel(8, "Larissa Cristina Moreira", 78.8),
            new AlunoRel(9, "Gustavo Pereira Ramos", 74.2),
            new AlunoRel(10, "Paula Regina da Silva", 71.5)
        ];

        return ranking;
    }

    async buscarRankingAlunosCurso() : Promise<AlunoCursoRel[]> {
        const ranking: AlunoCursoRel[] = [
            new AlunoCursoRel("Excel Intermediário", 1, "Ana Beatriz Mendes", 96),
            new AlunoCursoRel("Excel Intermediário", 2, "Carlos Henrique Silva", 93),
            new AlunoCursoRel("Excel Intermediário", 3, "Marcos Vinícius Duarte", 90),
            new AlunoCursoRel("Excel Intermediário", 4, "Julia Fernandes Costa", 87),
            new AlunoCursoRel("Excel Intermediário", 5, "Rafael Augusto Lopes", 84),
            new AlunoCursoRel("Excel Intermediário", 6, "Beatriz Souza Almeida", 80),
            new AlunoCursoRel("Excel Intermediário", 7, "Leonardo Martins Rocha", 76),
            new AlunoCursoRel("Excel Intermediário", 8, "Larissa Cristina Moreira", 73),
            new AlunoCursoRel("Excel Intermediário", 9, "Gustavo Pereira Ramos", 70),
            new AlunoCursoRel("Excel Intermediário", 10, "Paula Regina da Silva", 68),

            new AlunoCursoRel("Geografia", 1, "Ana Beatriz Mendes", 95),
            new AlunoCursoRel("Geografia", 2, "Carlos Henrique Silva", 92),
            new AlunoCursoRel("Geografia", 3, "Marcos Vinícius Duarte", 89),
            new AlunoCursoRel("Geografia", 4, "Beatriz Souza Almeida", 86),
            new AlunoCursoRel("Geografia", 5, "Julia Fernandes Costa", 83),
            new AlunoCursoRel("Geografia", 6, "Leonardo Martins Rocha", 79),
            new AlunoCursoRel("Geografia", 7, "Larissa Cristina Moreira", 76),
            new AlunoCursoRel("Geografia", 8, "Rafael Augusto Lopes", 74),
            new AlunoCursoRel("Geografia", 9, "Gustavo Pereira Ramos", 71),
            new AlunoCursoRel("Geografia", 10, "Paula Regina da Silva", 69),

            new AlunoCursoRel("Matemática Básica", 1, "Ana Beatriz Mendes", 97),
            new AlunoCursoRel("Matemática Básica", 2, "Carlos Henrique Silva", 94),
            new AlunoCursoRel("Matemática Básica", 3, "Julia Fernandes Costa", 90),
            new AlunoCursoRel("Matemática Básica", 4, "Marcos Vinícius Duarte", 87),
            new AlunoCursoRel("Matemática Básica", 5, "Beatriz Souza Almeida", 84),
            new AlunoCursoRel("Matemática Básica", 6, "Rafael Augusto Lopes", 82),
            new AlunoCursoRel("Matemática Básica", 7, "Leonardo Martins Rocha", 78),
            new AlunoCursoRel("Matemática Básica", 8, "Larissa Cristina Moreira", 75),
            new AlunoCursoRel("Matemática Básica", 9, "Gustavo Pereira Ramos", 72),
            new AlunoCursoRel("Matemática Básica", 10, "Paula Regina da Silva", 70),
        ];

        return ranking;
    }
}