import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioAlunosAPI } from '../../src/model/repositorio/RepositorioAlunosApi';
import { RespostaAlunoCadastro } from '../../src/model/dto/RespostaAlunoCadastro';
import { NaoAutorizadoException } from '../../src/model/exception/NaoAutorizadoException';

describe(RepositorioAlunosAPI.name, () => {
    let repositorio: RepositorioAlunosAPI;
    let fetchMock: any;

    beforeAll(() => {
        repositorio = new RepositorioAlunosAPI();
        fetchMock?.mockRestore();
    });

    describe(RepositorioAlunosAPI.prototype.enviarResposta.name, () => {

        it('Lança NaoAutorizadoException quando status é 401', async () => {

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 401
            } as any);

            const resposta = new RespostaAlunoCadastro(1, [1 , 2]);

            await expect(async () =>
                await repositorio.enviarResposta(resposta)
            ).rejects.toThrow(NaoAutorizadoException);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as any);

            const resposta = new RespostaAlunoCadastro(1, [1 , 2]);

            await expect(async () =>
                await repositorio.enviarResposta(resposta)
            ).rejects.toThrow('Não foi possível salvar a Resposta.');
        });

    });
    
});
