import { describe, it, expect, beforeAll, vi} from 'vitest';
import { RepositorioAssuntosApi } from '../../src/model/repositorio/RepositorioAssuntosApi';
import { AssuntoListagem } from '../../src/model/dto/AssuntoListagem';

describe(RepositorioAssuntosApi.name, () => {
    let repositorio: RepositorioAssuntosApi;

    beforeAll(() => {
        repositorio = new RepositorioAssuntosApi();
    });

    describe(RepositorioAssuntosApi.prototype.buscarPorIdCurso.name, () => {
        
        it('Retorna um array de Assunto Listagem', async () => {
            const idCurso = 1;

            const assuntos = await repositorio.buscarPorIdCurso(idCurso);

            expect(Array.isArray(assuntos)).toBe(true);
            expect(assuntos.every(a => a instanceof AssuntoListagem)).toBe(true);
        });
        
        it('Lança uma exceção ao buscar por um id de curso inexistente', async () => {
            const idCurso = -1;

            await expect( async () => 
                await repositorio.buscarPorIdCurso(idCurso)
            ).rejects.toThrow();
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            const idCurso = 1;

            await expect(async () =>
                await repositorio.buscarPorIdCurso( idCurso)
            ).rejects.toThrow('Não foi possível buscar os assuntos.');

            fetchMock.mockRestore();
        });

    });

});
