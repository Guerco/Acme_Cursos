import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioCredenciaisApi } from '../../src/model/repositorio/RepositorioCredenciaisApi';
import { UsuarioListagem } from '../../src/model/dto/UsuarioListagem';
import { UsuarioCadastro } from '../../src/model/dto/UsuarioCadastro';
import { DominioException } from '../../src/model/exception/DominioException';

describe(RepositorioCredenciaisApi.name, () => {
    let repositorio: RepositorioCredenciaisApi;

    beforeAll(() => {
        repositorio = new RepositorioCredenciaisApi();
    });

    describe(RepositorioCredenciaisApi.prototype.listarTodos.name, () => {
        
        it('Retorna um array de Usuários', async () => {
            const usuarios = await repositorio.listarTodos();

            expect(Array.isArray(usuarios)).toBe(true);
            expect(usuarios.every(u => u instanceof UsuarioListagem)).toBe(true);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            await expect(async () =>
                await repositorio.listarTodos()
            ).rejects.toThrow('Não foi possível buscar os usuários.');

            fetchMock.mockRestore();
        });

    });

    describe(RepositorioCredenciaisApi.prototype.adicionar.name, () => {

        it('Lança uma exceção ao inserir um usuário com email já existente', async () => {
            const usuario = new UsuarioCadastro(
                'aluno@email.com',
                '123456',
                'Teste usuario',
                'Administrador'
            );
            
            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção ao inserir um usuário com um email inválido', async () => {
            const usuario = new UsuarioCadastro(
                'at@',
                '123456',
                'Teste usuario',
                'Administrador'
            );
            
            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção ao inserir uma senha com menos de 6 caracteres', async () => {
            const usuario = new UsuarioCadastro(
                'teste@email.com',
                '12345',
                'Teste usuario',
                'Administrador'
            );
            
            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção ao inserir um nome com menos de 2 caracteres', async () => {
            const usuario = new UsuarioCadastro(
                'teste@email.com',
                '123456',
                'T',
                'Administrador'
            );
            
            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção ao inserir um nome com mais de 100 caracteres', async () => {
            const usuario = new UsuarioCadastro(
                'teste@email.com',
                '123456',
                'A'.repeat(101),
                'Administrador'
            );
            
            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção ao inserir um tipo de usuário inexistente', async () => {
            const usuario = new UsuarioCadastro(
                'teste@email.com',
                '123456',
                'Teste usuario',
                'Teste'
            );
            
            await expect(async () =>
                await repositorio.adicionar(usuario)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
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

            fetchMock.mockRestore();
        });

    });
  
});
