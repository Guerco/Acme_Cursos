import { Page, expect, Locator } from 'playwright/test';
import { classes, ids } from '../../../src/ui/listagem-cursos-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.listagemCursos;

export class TelaListagemCursos { 
    constructor(
        private page: Page
    ){}

    // Interação com a tela
    async acessar(){
        await this.page.goto(URL);
    }

    private buscarCursos(): Locator{
        return this.page.locator(classes.curso);
    }

    async clicaPimeiroCard(){
        const cursos = this.buscarCursos();
        const primeiroCurso = cursos.first();
        await primeiroCurso.click();
        return primeiroCurso;
    }

    async preencheTextoBusca(texto : string) {
        const busca = this.page.locator('#input-busca');
        await busca.fill(texto);
    }

    async apertaEnter() {
        await this.page.keyboard.press('Enter');
    }
    
    // Expects
    async deveExibirCurso(){
        const cursos = this.buscarCursos();
        expect(await cursos.count()).toBeGreaterThanOrEqual(1);
    }

    async deveExibirAssuntosCurso(curso: Locator){
        const assuntos = curso.locator(classes.assuntos);
        expect(await assuntos.isVisible()).toBe(true);
    }

    async deveExibirCursosFiltrados(filtro : string) {
        await this.deveExibirCurso();
        const cursos = await this.buscarCursos().all();
        for(const c of cursos){
            const informacoes = c.locator(classes.infoCurso);
            await expect(informacoes).toContainText(filtro);
        }
    }

    async deveExibirMensagem( mensagem : string) {
        const mensagemExibida = await this.page.locator(ids.mensagem);
        await expect(mensagemExibida).toContainText(mensagem);
    }
}