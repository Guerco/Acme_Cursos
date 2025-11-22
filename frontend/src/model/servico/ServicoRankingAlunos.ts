import { AlunoRel } from "../dto/relatorio/AlunoRel";
import { AlunoCursoRel } from "../dto/relatorio/AlunoCursoRel";
import { RespositorioAlunos } from "../repositorio/RepositorioAlunos";

export class ServicoRankingAlunos {
    private rankingAlunos: AlunoRel[]|null = null;
    private rankingAlunosCurso?: AlunoCursoRel[]|null = null;

    constructor(
        private repositorio : RespositorioAlunos
    ){}

    async buscarRankingAlunos(nomeAluno: string) : Promise<AlunoRel[]> {
        const busca = nomeAluno.trim().toLowerCase();
        return await this.repositorio.buscarRankingAlunos(busca);
    }

    async buscarRankingAlunosCurso(nomeAluno: string) : Promise<AlunoCursoRel[]> {
        const busca = nomeAluno.trim().toLowerCase();
        return await this.repositorio.buscarRankingAlunosCurso(busca);
    }

}