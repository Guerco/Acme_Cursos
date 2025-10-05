import { Page, expect, Locator } from 'playwright/test';
import { classes } from '../../../src/ui/listagem-cursos-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.listagemCursos;

export class TelaListagemCursos { 
    constructor(
        private page: Page
    ){}

    async acessar(){
        await this.page.goto(URL);
    }

    private async buscarCursos(): Promise<Locator>{
        return await this.page.locator(classes.curso);
    }

    async clicaPimeiroCard(){
        const cursos = await this.buscarCursos();
        const primeiroCurso = cursos.first();
        await primeiroCurso.click();
        return primeiroCurso;
    }

    // Expects
    async deveExibirCurso(){
        const cursos = await this.buscarCursos();
        expect(await cursos.count()).toBeGreaterThanOrEqual(1);
    }

    async deveExibirAssuntosCurso(curso: Locator){
        const assuntos =  curso.locator(classes.assuntos);
        expect(await assuntos.isVisible()).toBe(true);
    }
}