import { describe, it, expect, beforeAll } from 'vitest';
import { RepositorioCredenciaisApi } from '../../src/model/repositorio/RepositorioCredenciaisApi';
import { UsuarioListagem } from '../../src/model/dto/UsuarioListagem';

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

    });
  
});
