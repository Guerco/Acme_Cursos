import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioCredenciaisApi } from '../../src/model/repositorio/RepositorioCredenciaisApi';
import { UsuarioListagem } from '../../src/model/dto/UsuarioListagem';
import { UsuarioCadastro } from '../../src/model/dto/UsuarioCadastro';
import { DominioException } from '../../src/model/exception/DominioException';
import { NaoAutorizadoException } from '../../src/model/exception/NaoAutorizadoException';

describe(RepositorioCredenciaisApi.name, () => {
    let repositorio: RepositorioCredenciaisApi;
    let fetchMock: any;

    beforeAll(() => {
        repositorio = new RepositorioCredenciaisApi();
        fetchMock?.mockRestore();
    });

    describe(RepositorioCredenciaisApi.prototype.listarTodos.name, () => {
        
        it('Retorna um array de Usuários', async () => {
            const fakeJson = [{tipoUsuario: 'Administrador', 
                                    nome: 'Teste', 
                                    email: 'teste@email.com'
                                }];

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: true,
                    json: async () => fakeJson
                } as any);

            const usuarios = await repositorio.listarTodos();

            expect(Array.isArray(usuarios)).toBe(true);
            expect(usuarios.every(u => u instanceof UsuarioListagem)).toBe(true);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            await expect(async () =>
                await repositorio.listarTodos()
            ).rejects.toThrow('Não foi possível buscar os usuários.');

        });

        it('Lança NaoAutorizadoException quando status é 401', async () => {
                
            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 401
            } as any);

            await expect(async () =>
                await repositorio.listarTodos()
            ).rejects.toThrow(NaoAutorizadoException);
        });

    });

    describe(RepositorioCredenciaisApi.prototype.adicionar.name, () => {

        it('Lança uma exceção quando tentamos inserir um usuário inválido', async () => {
            const usuario = new UsuarioCadastro(
                'aluno@ema',
                '123456',
                'Teste usuario',
                'Administrador'
            );

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 400,
                json: async () => ({
                    erros: ['Email inválido']
                })
            } as Response);
            
            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            const usuario = new UsuarioCadastro(
                'teste@email.com',
                '123456',
                'Teste usuario',
                'Administrador'
            );

            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow('Erro ao salvar o usuário');
        });

        it('Lança NaoAutorizadoException quando status é 401', async () => {
                
            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 401
            } as any);

            const usuario = new UsuarioCadastro(
                'teste@email.com',
                '123456',
                'Teste usuario',
                'Administrador'
            );

            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow(NaoAutorizadoException);
        });
    });
  
});
