import { expect, Locator, Page } from "playwright/test";
import { rotasPaginas } from "../../../src/rotas";
import { classes, idsCss, values } from '../../../src/ui/ranking-alunos-ui';

const URL = rotasPaginas.rankingAlunos;

export class TelaRankingAlunos {
    constructor(private page: Page) { }
    
    // Interação com a tela
    async acessar() {
        await this.page.goto(`${URL}?assunto=3&curso=2`);
    }

    async selecionarRankingCurso() {
        const selecaoRanking = await this.buscarSelecaoRanking();

        await selecaoRanking.selectOption(values.curso);
    }

    // Expects
    async deveExibirAluno() {
        const tabela = this.page.locator(idsCss.tabelaRel);
        const primeiraLinha = tabela.locator('tbody tr').first();

        await expect(primeiraLinha).toBeVisible();
        await expect(primeiraLinha).toContainClass(classes.trAluno);
    }

    async deveExibirCurso() {
        const primeiraLinha = await this.buscarPrimeiraLinha();

        await expect(primeiraLinha).toBeVisible();
        await expect(primeiraLinha).toContainClass(classes.trCurso);
    }

    // Auxiliares
    private async buscarPrimeiraLinha(): Promise<Locator> {
        const tabela = this.page.locator(idsCss.tabelaRel);
        const primeiraLinha = tabela.locator('tbody tr').first();

        await primeiraLinha.waitFor({ state: 'visible', timeout: 5000 });
        return primeiraLinha;
    }

    private async buscarSelecaoRanking(): Promise<Locator> {
        const select = this.page.locator(idsCss.selectRanking);

        await select.waitFor({ state: 'visible', timeout: 5000 });
        return select;
    }
}