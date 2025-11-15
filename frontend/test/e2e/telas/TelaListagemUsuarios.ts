import { Page, expect } from 'playwright/test';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.listagemUsuarios;

export class TelaListagemUsuarios {
    constructor(
        private page: Page
    ) {}

        // Interação com a tela
        async acessar() {
            await this.page.goto(URL);
        }

        // Expects
        async deveExibirUsuario() {
            const usuarios = this.page.locator('tbody tr');
            await expect(usuarios.first()).toBeVisible({ timeout: 5000 });
        }
}