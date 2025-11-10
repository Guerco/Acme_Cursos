import { test } from 'playwright/test';
import { TelaListagemPerguntas } from './telas/TelaListagemPerguntas';

test.describe( 'Listagem de Perguntas', () => {
    let tela: TelaListagemPerguntas;

    test.beforeEach(async ({ page }) => {
        tela = new TelaListagemPerguntas(page);
        // Dado que acesso a tela de listagem de perguntas
        await tela.acessar();
    });

    // Cenário: Listagem apresenta pelo menos uma pergunta ao abrir
    test( 'Lista pelo menos uma pergunta', async () => {
        // Quando visualizo a tela
        // Então há pelo menos uma pergunta sendo listado.
        await tela.deveExibirPergunta();
    });
});