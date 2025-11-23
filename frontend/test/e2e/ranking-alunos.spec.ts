import { test, expect, Page } from 'playwright/test';
import { TelaRankingAlunos } from './telas/TelaRankingAlunos';
import { entrar } from './telas/entrar';

test.describe('Ranking de Alunos', () => {
    let tela: TelaRankingAlunos;

    test.beforeEach(async ({ page }) => {
        tela = new TelaRankingAlunos(page);

        await entrar(
                            page,
                            'adm@email.com',
                            '123'
                        )

        //     Dado que acesso a tela de ranking de alunos
        await tela.acessar();
    }); 

    // Cenário: Relatório exibe a lista de Alunos de melhor pontuação geral ao Abrir
    test('Exibe ranking alunos', async () => {
        //     Quando visualizo a tela
        //     Então há pelo menos um aluno listado no ranking.
        await tela.deveExibirAluno();
    });
    
    
    // Cenário: Relatório exibe a lista de Alunos de melhor pontuação por curso
    test('Exibe ranking cursos', async () => {
        //      Quando seleciono a opção ranking por curso
        await tela.selecionarRankingCurso();
        //      Então há pelo menos um curso listado no ranking.
        await tela.deveExibirCurso();
    });

});

