import { describe, it, expect, beforeAll } from 'vitest';
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

    });

});
