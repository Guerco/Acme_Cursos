import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioPerguntasApi } from '../../src/model/repositorio/RepositorioPerguntasApi';
import { PerguntaListagem } from '../../src/model/dto/PerguntaListagem';
import { PerguntaListagemQuiz } from '../../src/model/dto/PerguntaListagemQuiz';
import { DominioException } from '../../src/model/exception/DominioException';
import { PerguntaCadastro } from '../../src/model/dto/PerguntaCadastro';
import { RespostaPerguntaCadastro } from '../../src/model/dto/RespostaPerguntaCadastro';

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

        it('Lança uma exceção se a API estiver fora', async () => {
        
            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            await expect(async () =>
                await repositorio.buscarTodosOuPorAssunto()
            ).rejects.toThrow('Não foi possível buscar as perguntas.');

            fetchMock.mockRestore();
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

        it('Lança uma exceção se a API estiver fora', async () => {
        
            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            const idAssunto = 3;
            const idAluno = 1;

            await expect(async () =>
                await repositorio.buscarPerguntas(idAluno,idAssunto)
            ).rejects.toThrow('Não foi possível buscar as perguntas.');

            fetchMock.mockRestore();
        });

    });

    describe(RepositorioPerguntasApi.prototype.enviarPergunta.name, () => {
    
        it('Lança uma exceção se a API estiver fora', async () => {
        
            const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            const respostas = [];
            respostas.push(new RespostaPerguntaCadastro(
                    false,
                    'Teste Resposta')); 
    
            const pergunta = new PerguntaCadastro(
                6,
                'Teste pergunta',
                'media',
                60,
                respostas,
                'teste'
            );

            await expect(async () =>
                await repositorio.enviarPergunta(pergunta)
            ).rejects.toThrow('Não foi possível salvar a pergunta.');

            fetchMock.mockRestore();
        });
    });
});
