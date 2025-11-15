import { test } from 'playwright/test';
import { TelaListagemUsuarios } from './telas/TelaListagemUsuarios';

test.describe( 'Listagem de Usuários', () => {
    let tela: TelaListagemUsuarios;

    test.beforeEach(async ({ page }) => {
        tela = new TelaListagemUsuarios(page);
        // Dado que acesso a tela da listagem de usuários
        await tela.acessar();
    });

    // Cenário: Listagem apresenta pelo menos um usuário ao abrir
    test( 'Lista pelo menos um usuário', async () => {
        // Quando visualizo a tela
        // Então pelo menos um usuário é listado.
        await tela.deveExibirUsuario();
    });
});