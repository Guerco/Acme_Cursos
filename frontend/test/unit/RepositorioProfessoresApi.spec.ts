import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioProfessoresApi } from '../../src/model/repositorio/RepositorioProfessoresApi';
import { ProfessorListagem } from '../../src/model/dto/ProfessorListagem';

describe(RepositorioProfessoresApi.name, () => {
    let repositorio: RepositorioProfessoresApi;

    beforeAll(() => {
        repositorio = new RepositorioProfessoresApi();
    });

    describe(RepositorioProfessoresApi.prototype.buscarTodos.name, () => {
        
        it('Retorna um array de Professor Listagem', async () => {
            const professores = await repositorio.buscarTodos();

            expect(Array.isArray(professores)).toBe(true);
            expect(professores.every(p => p instanceof ProfessorListagem)).toBe(true);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            await expect(async () =>
                await repositorio.buscarTodos()
            ).rejects.toThrow('Não foi possível buscar os professores.');

            fetchMock.mockRestore();
        });

    });

});
