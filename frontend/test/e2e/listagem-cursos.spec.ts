import { test, expect, Page  } from 'playwright/test';
import { TelaListagemCursos } from './telas/TelaListagemCursos';

test.describe( 'Listagem de Cursos', () => {
    let tela: TelaListagemCursos;

    test.beforeEach(async ({ page }) => {
        tela = new TelaListagemCursos(page);
        // Dado que acesso a tela de listagem de cursos
        await tela.acessar();
    });

    // Cenário: Listagem apresenta pelo menos um curso ao abrir
    test( 'Lista pelo menos um curso', async () => {
        // Quando visualizo a tela
        // Então há pelo menos um curso sendo listado.
        await tela.deveExibirCurso();
    });

    // Cenário: Listagem apresenta os assuntos de um curso ao clicar em seu card
    test( 'Apresenta os assuntos do curso ao clicar no card', async () => {
        // Quando clico no card de um curso
        const primeiroCurso = await tela.clicaPimeiroCard();
        // Então o card se expande e lista os assuntos do curso em questão.
        tela.deveExibirAssuntosCurso(primeiroCurso);
    });

});