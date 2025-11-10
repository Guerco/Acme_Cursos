import { Page, expect, Locator } from 'playwright/test';
import { classesCss, idsCss } from '../../../src/ui/cadastro-perguntas-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.cadastroPerguntas;

export class TelaCadastroPerguntas {
    constructor(
        private page: Page
    ) { }

    // Interação com a tela
    async acessar() {
        await this.page.goto(URL);
    }

    async selecionarPrimeiroProfessor() {
        const selecaoProfessor = await this.buscarSelecaoProfessor();
        const primeiroProfessor = await selecaoProfessor.locator('option:not([hidden])').first();
        const idPrimeiroProfessor = await primeiroProfessor.getAttribute('value');
        await selecaoProfessor.selectOption(idPrimeiroProfessor);
    }

    async selecionarPrimeiroCurso() {
        const selecaoCurso = await this.buscarSelecaoCurso();
        const primeiroCurso = await selecaoCurso.locator('option:not([hidden])').first();
        const idPrimeiroCurso = await primeiroCurso.getAttribute('value');
        await selecaoCurso.selectOption(idPrimeiroCurso);
    }

    async clicarAdicionarResposta() {
        const botaoAdicionar = await this.buscarBotaoAdicionarResposta();
        await botaoAdicionar.click();
    }

    async clicarRemoverResposta() {
        const botaoRemover = await this.buscarBotaoRemoverResposta();
        await botaoRemover.click();
    }

    async alternarRespostaCorreta(nResposta: number) {
        const resposta = (await this.buscarRespostas()).nth(nResposta);
        const caixaCorreto = await this.buscarCaixaCorreto(resposta);
        await caixaCorreto.click();
    }

    async preencherEnunciadoComTexto(texto: string) {
        const campoEnunciado = await this.buscarCampoEnunciado();
        await campoEnunciado.fill(texto);
    }

    // Expects
    async deveListarProfessorNaSelecao() {
        const selecaoProfessor = await this.buscarSelecaoProfessor();
        const professores = selecaoProfessor.locator('option:not([hidden])');
        expect(await professores.count()).toBeGreaterThan(0);
    }

    async deveHabilitarSelecaoCursos() {
        const selecaoCurso = await this.buscarSelecaoCurso();
        await expect(selecaoCurso).not.toBeDisabled();
    }

    async deveListarCursoNaSelecao() {
        const selecaoCurso = await this.buscarSelecaoCurso();
        const cursos = selecaoCurso.locator('option:not([hidden])');
        expect(await cursos.count()).toBeGreaterThan(0);
    }

    async deveHabilitarSelecaoAssuntos() {
        const selecaoAssunto = await this.buscarSelecaoAssunto();
        await expect(selecaoAssunto).not.toBeDisabled();
    }

    async deveListarAssuntoNaSelecao() {
        const selecaoAssunto = await this.buscarSelecaoAssunto();
        const assunto = selecaoAssunto.locator('option:not([hidden])');
        expect(await assunto.count()).toBeGreaterThan(0);
    }

    async deveExibirSelecaoDificuldade() {
        const selecaoDificuldade = await this.buscarSelecaoDificuldade();
        await expect(selecaoDificuldade).toBeVisible();
    }

    async deveHaverOpcoesFacilMedioDificil() {
        const selecaoDificuldade = await this.buscarSelecaoDificuldade();
        const opcoes = selecaoDificuldade.locator('option:not([hidden])');

        await expect(opcoes.nth(0)).toContainText('Fácil');
        await expect(opcoes.nth(1)).toContainText('Médio');
        await expect(opcoes.nth(2)).toContainText('Difícil');
    }

    async deveExibirTerceiraCaixaDeResposta() {
        const terceiraCaixa = (await this.buscarRespostas()).nth(2);
        await expect(terceiraCaixa).toBeVisible();
    }

    async deveDesabilitarBotaoAdicionarResposta() {
        const botao = await this.buscarBotaoAdicionarResposta();
        expect(botao).toBeDisabled();
    }

    async deveDesabilitarBotaoRemoverResposta() {
        const botao = await this.buscarBotaoRemoverResposta();
        expect(botao).toBeDisabled();
    }

    async deveOcultarTerceiraCaixaDeResposta() {
        const terceiraCaixa = (await this.buscarRespostas()).nth(2);
        await expect(terceiraCaixa).not.toBeVisible();
    }

    async deveMarcarPrimeiraRespostaCorreta() {
        const resposta = (await this.buscarRespostas()).nth(0);
        const caixaCorreto = await this.buscarCaixaCorreto(resposta);
        await expect(caixaCorreto).toBeChecked();
    }

    async deveDesmarcarPrimeiraRespostaCorreta() {
        const resposta = (await this.buscarRespostas()).nth(0);
        const caixaCorreto = await this.buscarCaixaCorreto(resposta);
        await expect(caixaCorreto).not.toBeChecked();
    }

    async deveExibirCampoEnunciado() {
        const campoEnunciado = await this.buscarCampoEnunciado();
        await expect(campoEnunciado).toBeVisible();
    }

    async deveExibirEnunciadoComTamanho(tamanho : number) {
        const campoEnunciado = await this.buscarCampoEnunciado();
        const texto = await campoEnunciado.inputValue();
        expect(texto.length).toBe(tamanho);
    }

    // Auxiliares
    private async buscarSelecaoProfessor(): Promise<Locator> {
        const select = this.page.locator(idsCss.selectProfessor);
        await select.waitFor({ state: 'visible', timeout: 5000 });
        return select;
    }

    private async buscarSelecaoCurso(): Promise<Locator> {
        const select = this.page.locator(idsCss.selectCurso);
        await select.waitFor({ state: 'visible', timeout: 5000 });
        return select;
    }

    private async buscarSelecaoAssunto(): Promise<Locator> {
        const select = this.page.locator(idsCss.selectAssunto);
        await select.waitFor({ state: 'visible', timeout: 5000 });
        return select;
    }

    private async buscarSelecaoDificuldade(): Promise<Locator> {
        const select = this.page.locator(idsCss.selectDificuldade);
        await select.waitFor({ state: 'visible', timeout: 5000 });
        return select;
    }

    private async buscarBotaoAdicionarResposta(): Promise<Locator> {
        const botao = this.page.locator(idsCss.botaoAdicionarResposta);
        await botao.waitFor({ state: 'visible', timeout: 5000 });
        return botao;
    }

    private async buscarRespostas(): Promise<Locator> {
        const respostas = this.page.locator(classesCss.resposta);
        await respostas.first().waitFor({ state: 'visible', timeout: 5000 });
        return respostas;
    }

    private async buscarBotaoRemoverResposta(): Promise<Locator> {
        const botao = this.page.locator(idsCss.botaoRemoverResposta);
        await botao.waitFor({ state: 'visible', timeout: 5000 });
        return botao;
    }

    private async buscarCaixaCorreto(resposta: Locator): Promise<Locator> {
        const caixaCorreto = resposta.locator('input[type="checkbox"]');
        await caixaCorreto.waitFor({ state: 'visible', timeout: 5000 });
        return caixaCorreto;
    }

    private async buscarCampoEnunciado(): Promise<Locator> {
        const campoEnunciado = this.page.locator(idsCss.campoDescricao);
        await campoEnunciado.waitFor({ state: 'visible', timeout: 5000 });
        return campoEnunciado;
    }
}