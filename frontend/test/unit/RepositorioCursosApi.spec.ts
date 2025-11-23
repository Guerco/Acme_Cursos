import { describe, it, expect, beforeAll, vi } from 'vitest';
import { RepositorioCursosApi } from '../../src/model/repositorio/RepositorioCursosApi';
import { CursoListagem } from '../../src/model/dto/CursoListagem';
import { CursoListagemResumo } from '../../src/model/dto/CursoListagemResumo';
import { CursoQtdAlunoRel } from '../../src/model/dto/relatorio/CursoQtdAlunoRel';
import { RepositorioLoginAPI } from '../../src/model/repositorio/RepositorioLoginAPI';
import { Credenciais } from '../../src/model/dto/Credenciais';
import { NaoAutorizadoException } from '../../src/model/exception/NaoAutorizadoException';

describe(RepositorioCursosApi.name, () => {
    let repositorio: RepositorioCursosApi;
    let fetchMock: any;


    beforeAll(() => {
        repositorio = new RepositorioCursosApi();
        fetchMock?.mockRestore();
    });

    describe(RepositorioCursosApi.prototype.buscarTodos.name, () => {
        
        it('Retorna uma array de Cursos Listagem', async () => {
            const fakeJson = [{id: 1,
                                    descricao: "Curso 1",
                                    caminhoImg: "teste/caminho",
                                    nomeProfessor: "Professor teste",
                                    assuntos: [
                                        {
                                            id: 1,
                                            descricao: "teste"
                                        }
                                    ]
                                }
                            ];

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: true,
                    json: async () => fakeJson
                } as any);

            const cursos = await repositorio.buscarTodos();

            expect(Array.isArray(cursos)).toBe(true);
            expect(cursos.every(c => c instanceof CursoListagem)).toBe(true);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            await expect(async () =>
                await repositorio.buscarTodos()
            ).rejects.toThrow('Não foi possível buscar os cursos.');

        });

    });

    describe(RepositorioCursosApi.prototype.buscarPorDescricaoOuProfessor.name, () => {
        
        it('Retorna uma array de Cursos Listagem filtrados', async () => {
            const filtro = 'geografia';
            const fakeJson = [{id: 1,
                                    descricao: "Geografia",
                                    caminhoImg: "teste/caminho",
                                    nomeProfessor: "Professor teste",
                                    assuntos: [
                                        {
                                            id: 1,
                                            descricao: "teste"
                                        }
                                    ]
                                }
                            ];

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: true,
                    json: async () => fakeJson
                } as any);

            const cursos = await repositorio.buscarPorDescricaoOuProfessor(filtro);

            expect(Array.isArray(cursos)).toBe(true);
            expect(cursos.every(c => {
                return (
                    c instanceof CursoListagem
                    && (
                        c.descricao.toLowerCase().includes(filtro.toLowerCase())
                        || c.nomeProfessor.toLowerCase().includes(filtro.toLowerCase())
                    )
                )
            })).toBe(true);
        });

        it('Retorna um array vazio ao buscar um texto inexistente', async () => {
            const filtro = 'wZ786das88WX8N8x7w';

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: true,
                    json: async () => []
                } as any);

            const cursos = await repositorio.buscarPorDescricaoOuProfessor(filtro);

            expect(Array.isArray(cursos)).toBe(true);
            expect(cursos.length === 0).toBe(true);
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            const filtro = 'geografia';

            await expect(async () =>
                await repositorio.buscarPorDescricaoOuProfessor(filtro)
            ).rejects.toThrow('Não foi possível buscar os cursos filtrados.');

        });

    });

    describe(RepositorioCursosApi.prototype.buscarResumidoPorIdProfessor.name, () => {
        
        it('Retorna um array de Curso Listagem Resumo', async () => {
            const idProfessor = 1;
            const fakeJson = [
                { id: 1, descricao: 'Curso Teste' },
                { id: 2, descricao: 'Curso Teste 2' },
            ];

            fetchMock = vi.spyOn(globalThis, 'fetch')
                .mockResolvedValue({
                    ok: true,
                    json: async () => fakeJson
                } as any);


            const cursos = await repositorio.buscarResumidoPorIdProfessor(idProfessor);

            expect(Array.isArray(cursos)).toBe(true);
            expect(cursos.every(c => c instanceof CursoListagemResumo)).toBe(true);
        });
        
        it('Lança uma exceção ao buscar por um id de professor inexistente', async () => {
            const idProfessor = -1;
            fetchMock = vi
                .spyOn(globalThis, 'fetch')
                .mockResolvedValue({
                    ok: false,
                    status: 404
                } as any);

            await expect( async () => 
                await repositorio.buscarResumidoPorIdProfessor(idProfessor)
            ).rejects.toThrow();
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            const idProfessor = 1;

            await expect(async () =>
                await repositorio.buscarResumidoPorIdProfessor(idProfessor)
            ).rejects.toThrow('Não foi possível buscar os cursos.');

        });

        it('Lança NaoAutorizadoException quando status é 401', async () => {
                        
            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 401
            } as any);

            await expect(async () =>
                await repositorio.buscarResumidoPorIdProfessor(1)
            ).rejects.toThrow(NaoAutorizadoException);
        });

    });

    describe(RepositorioCursosApi.prototype.buscarNumeroDeAlunosPorCurso.name, () => {
        
        it('Retorna uma array de números de alunos por cursos', async () => {

            const fakeJson = [
                { descricao: 'Curso Teste', quantidade: 30 },
                { descricao: 'Curso Teste 2', quantidade: 22 }
            ];

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                    ok: true,
                    json: async () => fakeJson
                } as any);


            const dados = await repositorio.buscarNumeroDeAlunosPorCurso();

            expect(Array.isArray(dados)).toBe(true);
            expect(dados.every(d => d instanceof CursoQtdAlunoRel)).toBe(true);
            
        });

        it('Lança uma exceção se a API estiver fora', async () => {

            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 500
            } as Response);

            await expect(async () =>
                await repositorio.buscarNumeroDeAlunosPorCurso()
            ).rejects.toThrow('Não foi possível listar o número de alunos por curso.');

        });

        it('Lança NaoAutorizadoException quando status é 401', async () => {
                        
            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
                status: 401
            } as any);

            await expect(async () =>
                await repositorio.buscarNumeroDeAlunosPorCurso()
            ).rejects.toThrow(NaoAutorizadoException);
        });

    });

});
