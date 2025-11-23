import { describe, it, expect, beforeAll, vi} from 'vitest';
import { RepositorioAssuntosApi } from '../../src/model/repositorio/RepositorioAssuntosApi';
import { AssuntoListagem } from '../../src/model/dto/AssuntoListagem';
import { NaoAutorizadoException } from '../../src/model/exception/NaoAutorizadoException';

describe(RepositorioAssuntosApi.name, () => {
    let repositorio: RepositorioAssuntosApi;
    let fetchMock: any;

    beforeAll(() => {
        repositorio = new RepositorioAssuntosApi();
        fetchMock?.mockRestore();
    });

    describe(RepositorioAssuntosApi.prototype.buscarPorIdCurso.name, () => {
        
        it('Retorna um array de Assunto Listagem', async () => {
            const idCurso = 1;

            const fakeJson = [
                { id: 1, descricao: 'Assunto teste 1' },
                { id: 2, descricao: 'Assunto teste 2' }
            ];

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: true,
                    json: async () => fakeJson
                } as any);

            const assuntos = await repositorio.buscarPorIdCurso(idCurso);

            expect(Array.isArray(assuntos)).toBe(true);
            expect(assuntos.every(a => a instanceof AssuntoListagem)).toBe(true);
        });
        
        it('Lança uma exceção ao buscar por um id de curso inexistente', async () => {
            const idCurso = -1;

            fetchMock = vi
                .spyOn(globalThis, 'fetch')
                .mockResolvedValue({
                    ok: false,
                    status: 404
                } as any);

            await expect( async () => 
                await repositorio.buscarPorIdCurso(idCurso)
            ).rejects.toThrow();
        });

        it('Lança NaoAutorizadoException quando status é 401', async () => {
                
            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 401
            } as any);

            await expect(async () =>
                await repositorio.buscarPorIdCurso(1)
            ).rejects.toThrow(NaoAutorizadoException);
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

        });

    });

});
