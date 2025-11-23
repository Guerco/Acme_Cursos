import { test } from 'playwright/test';
import { TelaListagemPerguntas } from './telas/TelaListagemPerguntas';
import { entrar } from './telas/entrar';

test.describe( 'Listagem de Perguntas', () => {
    let tela: TelaListagemPerguntas;

    test.beforeEach(async ({ page }) => {
        tela = new TelaListagemPerguntas(page);

        await entrar(
                            page,
                            'adm@email.com',
                            '123'
                        )
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