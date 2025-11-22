import { Page, expect } from 'playwright/test';
import { rotasPaginas } from '../../../src/rotas';
import { ids, idsCss } from '../../../src/ui/alunos-cursos-ui';

const URL = rotasPaginas.numeroDeAlunosPorCurso;

export class TelaAlunosCursos {
    constructor(
        private page: Page
    ) {}

        // Interação com a tela
        async acessar() {
            await this.page.goto(URL);
        }

        // Expects
        async deveExibirGráfico() {
            await this.canvasVisivel();
            await this.canvasComTamanhoValido();
            await this.canvasComPixels();
        }

        // Auxiliar

        async buscarCanvas(){
                const canvas = await this.page.locator(idsCss.canva);
                return canvas;
        }

        async canvasVisivel() {
            const canvas = await this.buscarCanvas();
            await expect(canvas).toBeVisible();
        }

        async canvasComTamanhoValido() {
            const canvas = await this.buscarCanvas();
            const box = await canvas.boundingBox();
            expect(box?.width).toBeGreaterThan(200);
            expect(box?.height).toBeGreaterThan(200);
        }

        async canvasComPixels() {
            const canvas = await this.buscarCanvas();
            const pixelData = await canvas.screenshot();
            expect(pixelData.length).toBeGreaterThan(1000);
        }
}