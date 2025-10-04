import { test, expect, Page } from 'playwright/test';

const URL = 'http://localhost:5173';

test.describe( 'Listagem de Cursos', () => {

    // Cenário: Listagem apresenta pelo menos um curso ao abrir
    test( 'Lista pelo menos um curso', async ({page}: {page: Page}) => {
        //     Dado que acesso a tela de lsitagem de cursos
        await page.goto(URL)
        //     Quando eu visualizo a tela
        const cursos = await page.locator('.card-curso');
        //     Então há pelo menos um curso sendo listado
        expect(await cursos.count()).toBeGreaterThanOrEqual(1);
    });
});