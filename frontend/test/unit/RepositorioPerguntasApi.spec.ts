import { describe, it, expect, beforeAll } from 'vitest';
import { RepositorioPerguntasApi } from '../../src/model/repositorio/RepositorioPerguntasApi';
import { PerguntaListagem } from '../../src/model/dto/PerguntaListagem';
import { PerguntaListagemQuiz } from '../../src/model/dto/PerguntaListagemQuiz';
import { DominioException } from '../../src/model/exception/DominioException';

describe(RepositorioPerguntasApi.name, () => {
    let repositorio: RepositorioPerguntasApi;

    beforeAll(() => {
        repositorio = new RepositorioPerguntasApi();
    });

    describe(RepositorioPerguntasApi.prototype.buscarTodosOuPorAssunto.name, () => {
        
        it('Retorna um array de Pergunta Listagem', async () => {
            const perguntas = await repositorio.buscarTodosOuPorAssunto();

            expect(Array.isArray(perguntas)).toBe(true);
            expect(perguntas.every(p => p instanceof PerguntaListagem)).toBe(true);
        });
        
        it('Retorna um array de Pergunta Listagem filtrado pelo assunto', async () => {
            const idAssunto = 3;
            const descricaoAssunto = 'Soma';
            
            const perguntas = await repositorio.buscarTodosOuPorAssunto(idAssunto);

            expect(Array.isArray(perguntas)).toBe(true);
            expect(perguntas.every(p => 
                (p instanceof PerguntaListagem && p.descricaoAssunto == descricaoAssunto)
            )).toBe(true);
        });

        
        it('Lança uma exceção ao buscar por um id de assunto inexistente', async () => {
            const idAssunto = -1;
            
            await expect(async () =>
                await repositorio.buscarTodosOuPorAssunto(idAssunto)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção ao buscar por um id de assunto sem perguntas', async () => {
            const idAssunto = 1;
            
            await expect(async () =>
                await repositorio.buscarTodosOuPorAssunto(idAssunto)
            ).rejects.toThrow(DominioException);
        });

    });

    describe(RepositorioPerguntasApi.prototype.buscarPerguntas.name, () => {

        it('Retorna um array de Pergunta Listagem Quiz', async () => {
            const idAssunto = 3;
            const idAluno = 1;

            const perguntas = await repositorio.buscarPerguntas(idAluno, idAssunto);

            expect(Array.isArray(perguntas)).toBe(true);
            expect(perguntas.every(p => p instanceof PerguntaListagemQuiz)).toBe(true);
        });

        it('Lança uma exceção ao buscar por um id de assunto inexistente', async () => {
            const idAssunto = -1;
            const idAluno = 1;

            await expect(async () =>
                await repositorio.buscarPerguntas(idAluno,idAssunto)
            ).rejects.toThrow(DominioException);
        });

        it('Lança uma exceção ao buscar por um id de aluno inexistente', async () => {
            const idAssunto = 1;
            const idAluno = -1;

            await expect(async () =>
                await repositorio.buscarPerguntas(idAluno,idAssunto)
            ).rejects.toThrow(DominioException);
        });

    });
});
