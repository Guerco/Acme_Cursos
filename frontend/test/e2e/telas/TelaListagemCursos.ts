import { Page, expect, Locator } from 'playwright/test';
import { classes, ids } from '../../../src/ui/listagem-cursos-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.listagemCursos;

export class TelaListagemCursos {
    constructor(
        private page: Page
    ) { }

    // Interação com a tela
    async acessar() {
        await this.page.goto(URL);
        await this.page.locator(classes.curso).first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async clicarPrimeiroCard() {
        const primeiroCurso = this.page.locator(classes.curso).first();
        await primeiroCurso.waitFor({ state: 'visible', timeout: 5000 });
        await primeiroCurso.click();
        return primeiroCurso;
    }

    async preencheTextoBusca(texto: string) {
        const busca = this.page.locator(ids.busca);
        await busca.waitFor({ state: 'visible', timeout: 5000 });
        await busca.fill(texto);
    }

    async apertaEnter() {
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
    }

    // Expects
    async deveExibirCurso() {
        const cursos = this.page.locator(classes.curso);
        await expect(cursos.first()).toBeVisible({ timeout: 5000 });
    }

    async deveExibirAssuntosCurso(curso: Locator) {
        const assuntos = curso.locator(classes.assuntos);
        await expect(assuntos).toBeVisible({ timeout: 5000 });
    }

    async deveExibirCursosFiltrados(filtro: string) {
        const cursos = this.page.locator(classes.curso);
        await expect(cursos.first()).toBeVisible({ timeout: 5000 });

        const cursosList = await cursos.all();
        
        for (const c of cursosList) {
            const informacoes = c.locator(classes.infoCurso);
            await expect(informacoes).toContainText(filtro, { timeout: 5000 });
        }
    }

    async deveExibirMensagem(mensagem: string) {
        const mensagemExibida = this.page.locator(ids.mensagem);
        await expect(mensagemExibida).toContainText(mensagem, { timeout: 5000 });
    }
}