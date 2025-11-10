import { Page, expect, Locator } from 'playwright/test';
import { classesCss, idsCss } from '../../../src/ui/listagem-perguntas-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.listagemPerguntas;

export class TelaListagemPerguntas {
    constructor(
        private page: Page
    ) { }

    // Interação com a tela
    async acessar() {
        await this.page.goto(URL);
    }

    // Expects
    async deveExibirPergunta() {
        const perguntas = this.page.locator(classesCss.pergunta);
        await expect(perguntas.first()).toBeVisible({ timeout: 5000 });
    }
}