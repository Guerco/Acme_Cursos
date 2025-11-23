import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioProfessoresApi } from '../../src/model/repositorio/RepositorioProfessoresApi';
import { ProfessorListagem } from '../../src/model/dto/ProfessorListagem';
import { NaoAutorizadoException } from '../../src/model/exception/NaoAutorizadoException';

describe(RepositorioProfessoresApi.name, () => {
    let repositorio: RepositorioProfessoresApi;
    let fetchMock: any;

    beforeAll(() => {
        repositorio = new RepositorioProfessoresApi();
        fetchMock?.mockRestore();
    });

    describe(RepositorioProfessoresApi.prototype.buscarTodos.name, () => {
        
        it('Retorna um array de Professor Listagem', async () => {
            const fakeJson = [
                { id: 1, nome: 'Professor 1' },
                { id: 2, nome: 'Professor 2' }
            ];

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: true,
                    json: async () => fakeJson
                } as any);

            const professores = await repositorio.buscarTodos();

            expect(Array.isArray(professores)).toBe(true);
            expect(professores.every(p => p instanceof ProfessorListagem)).toBe(true);
        });

        it('Lança NaoAutorizadoException quando status é 401', async () => {
        
            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 401
            } as any);

            await expect(async () =>
                await repositorio.buscarTodos()
            ).rejects.toThrow(NaoAutorizadoException);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            await expect(async () =>
                await repositorio.buscarTodos()
            ).rejects.toThrow('Não foi possível buscar os professores.');

        });

    });

});
