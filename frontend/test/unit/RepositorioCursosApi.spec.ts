import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioCursosApi } from '../../src/model/repositorio/RepositorioCursosApi';
import { CursoListagem } from '../../src/model/dto/CursoListagem';
import { CursoListagemResumo } from '../../src/model/dto/CursoListagemResumo';

describe(RepositorioCursosApi.name, () => {
    let repositorio: RepositorioCursosApi;

    beforeAll(() => {
        repositorio = new RepositorioCursosApi();
    });

    describe(RepositorioCursosApi.prototype.buscarTodos.name, () => {
        
        it('Retorna uma array de Cursos Listagem', async () => {
            const cursos = await repositorio.buscarTodos();

            expect(Array.isArray(cursos)).toBe(true);
            expect(cursos.every(c => c instanceof CursoListagem)).toBe(true);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            await expect(async () =>
                await repositorio.buscarTodos()
            ).rejects.toThrow('Não foi possível buscar os cursos.');

            fetchMock.mockRestore();
        });

    });

    describe(RepositorioCursosApi.prototype.buscarPorDescricaoOuProfessor.name, () => {
        
        it('Retorna uma array de Cursos Listagem filtrados', async () => {
            const filtro = 'geografia';
            const cursos = await repositorio.buscarPorDescricaoOuProfessor(filtro);

            expect(Array.isArray(cursos)).toBe(true);
            expect(cursos.every(c => {
                return (
                    c instanceof CursoListagem
                    && (
                        c.descricao.toLowerCase().includes(filtro.toLowerCase())
                        || c.nomeProfessor.toLowerCase().includes(filtro.toLowerCase())
                    )
                )
            })).toBe(true);
        });

        it('Retorna um array vazio ao buscar um texto inexistente', async () => {
            const filtro = 'wZ786das88WX8N8x7w';
            const cursos = await repositorio.buscarPorDescricaoOuProfessor(filtro);

            expect(Array.isArray(cursos)).toBe(true);
            expect(cursos.length === 0).toBe(true);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            const filtro = 'geografia';

            await expect(async () =>
                await repositorio.buscarPorDescricaoOuProfessor(filtro)
            ).rejects.toThrow('Não foi possível buscar os cursos filtrados.');

            fetchMock.mockRestore();
        });

    });

    describe(RepositorioCursosApi.prototype.buscarResumidoPorIdProfessor.name, () => {
        
        it('Retorna um array de Curso Listagem Resumo', async () => {
            const idProfessor = 1;

            const cursos = await repositorio.buscarResumidoPorIdProfessor(idProfessor);

            expect(Array.isArray(cursos)).toBe(true);
            expect(cursos.every(c => c instanceof CursoListagemResumo)).toBe(true);
        });
        
        it('Lança uma exceção ao buscar por um id de professor inexistente', async () => {
            const idProfessor = -1;

            await expect( async () => 
                await repositorio.buscarResumidoPorIdProfessor(idProfessor)
            ).rejects.toThrow();
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            const idProfessor = 1;

            await expect(async () =>
                await repositorio.buscarResumidoPorIdProfessor(idProfessor)
            ).rejects.toThrow('Não foi possível buscar os cursos.');

            fetchMock.mockRestore();
        });

    });

});
