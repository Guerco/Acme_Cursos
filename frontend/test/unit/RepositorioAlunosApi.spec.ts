import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioAlunosAPI } from '../../src/model/repositorio/RepositorioAlunosApi';
import { Credenciais } from '../../src/model/dto/Credenciais';
import { AlunoListagem } from '../../src/model/dto/AlunoListagem';
import { DominioException } from '../../src/model/exception/DominioException';

describe(RepositorioAlunosAPI.name, () => {
    let repositorio: RepositorioAlunosAPI;

    beforeAll(() => {
        repositorio = new RepositorioAlunosAPI();
    });

    describe(RepositorioAlunosAPI.prototype.verificarCredenciais.name, () => {
        
        it('Retorna um Aluno Listagem', async () => {
            const credenciais = new Credenciais(
                'aluno@email.com',
                '123'
            );
            await credenciais.aplicarHashSenha();

            const aluno = await repositorio.verificarCredenciais(credenciais);

            expect(aluno instanceof AlunoListagem).toBe(true);
        });

        it('Lança uma exceção ao informar credenciais inválidas', async() => {
            const credenciais = new Credenciais(
                'emailerrado@email.com',
                'saijkfhgnsiadtyfaejk'
            );
            await credenciais.aplicarHashSenha();

            await expect( async() => 
                await repositorio.verificarCredenciais(credenciais)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);
            const credenciais = new Credenciais(
                'aluno@email.com',
                '123'
            );

            await expect(async () =>
                await repositorio.verificarCredenciais(credenciais)
            ).rejects.toThrow('Não foi possível verificar as crecenciais.');

            fetchMock.mockRestore();
        });

    });
    
});
