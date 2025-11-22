import { test } from 'playwright/test';
import { TelaAlunosCursos } from './telas/TelaAlunosCursos';
import { entrar } from './telas/entrar';

test.describe( 'Gráfico de total de alunos por curso', () => {
    let tela: TelaAlunosCursos;

    test.beforeEach(async ({ page }) => {
        tela = new TelaAlunosCursos(page);

        await entrar(
                    page,
                    'adm@email.com',
                    '123'
                )
        // Dado que acesso a tela de gráfico de alunos cursos
        await tela.acessar();
    });

    // Cenário: O gráfico apresenta pelo menos um curso com a quantidade de alunos ao abrir 
    test( 'Mostra pelo menos um curso e a quantidade de alunos', async () => {
        // Quando visualizo a tela
        // Então pelo menos um curso com a quantidade de alunos é mostrada no gráfico.
        await tela.deveExibirGráfico();
    });
});