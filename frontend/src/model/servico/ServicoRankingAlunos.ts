import { AlunoRel } from "../dto/relatorio/AlunoRel";
import { AlunoCursoRel } from "../dto/relatorio/AlunoCursoRel";
import { RespositorioAlunos } from "../repositorio/RepositorioAlunos";

export class ServicoRankingAlunos {
    private rankingAlunos: AlunoRel[]|null = null;
    private rankingAlunosCurso?: AlunoCursoRel[]|null = null;

    constructor(
        private repositorio : RespositorioAlunos
    ){}

    async buscarRankingAlunos() : Promise<AlunoRel[]> {
        return this.rankingAlunos ??= await this.repositorio.buscarRankingAlunos();
    }

    async buscarRankingAlunosCurso() : Promise<AlunoCursoRel[]> {
        return this.rankingAlunosCurso ??= await this.repositorio.buscarRankingAlunosCurso();
    }

    async buscarRankingFiltrado(nomeAluno: string) : Promise<AlunoRel[]> {
        const busca = nomeAluno.trim().toLowerCase();
        
        const ranking = await this.buscarRankingAlunos();

        return ranking.filter(a =>
            a.nome.toLowerCase().includes(busca)
        );
    }

    async buscarRankingCursoFiltrado(nomeAluno: string) : Promise<AlunoCursoRel[]> {
        const busca = nomeAluno.trim().toLowerCase();
        
        const ranking = await this.buscarRankingAlunosCurso();

        return ranking.filter(a =>
            a.nome.toLowerCase().includes(busca)
            || a.nomeCurso.toLowerCase().includes(busca)
        );
    }
}