import { Page, expect, Locator } from 'playwright/test';
import { classes, ids, classesCss, idsCss } from '../../../src/ui/cabecalho-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.listagemCursos;

export class TelaLogin {
    constructor(
        private page: Page
    ) { }

    // Interação com a tela
    async acessar() {
        await this.page.goto(URL);
        await this.page.locator(classesCss.cabecalho).first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async clicarEntrar() {
        const botaoEntrar = this.page.locator(classesCss.entrarCabecalho).first();
        await botaoEntrar.waitFor({ state: 'visible', timeout: 5000 });
        await botaoEntrar.click();
    }
    
    async preencherCredenciais(email : string, senha : string) {
        const inputEmail = await this.buscarInputEmail();
        const inputSenha = await this.buscarInputSenha();
        
        await inputEmail.fill(email);
        await inputSenha.fill(senha);
    }
    
    async clicarEnviarLogin() {
        const botaoEnviar = this.page.locator(idsCss.botaoEnviar);
        await botaoEnviar.waitFor({ state: 'visible', timeout: 5000 });
        await botaoEnviar.click();
    }

    // Expects
    async deveExibirCaixaCredenciais() {
        const caixa = await this.buscarCaixaCredenciais();
        await expect(caixa).toHaveAttribute('open', '');
    }
    
    async deveExibirMensagemCredenciais() {
        const botaoEntrar = this.page.locator(idsCss.mensagemLogin);
        await botaoEntrar.waitFor({ state: 'visible', timeout: 5000 });
        
        expect(botaoEntrar).toContainText('Credenciais Inválidas.');
    }
    
    async deveFecharCaixaCredenciais() {
        await expect(this.page.locator(idsCss.caixaCredenciais)).toHaveCount(0);
    }

    async deveExibirNomeNoCabecalho(nome: string) {
        const nomeCabecalho = this.page.locator(classesCss.nomeUsuarioHeader);
        await nomeCabecalho.waitFor({ state: 'visible', timeout: 5000 });

        expect(nomeCabecalho).toContainText('Olá, '+nome);
    }

    async deveInvalidarEmail() {
        const email = await this.buscarInputEmail();
        await expect(email).toHaveJSProperty('validity.valid', false);
        await expect(email).toHaveJSProperty('validity.typeMismatch', true);
    }

    // Auxiliares
    private async buscarCaixaCredenciais(): Promise<Locator> {
        const caixa = this.page.locator(idsCss.caixaCredenciais);
        await caixa.waitFor({ state: 'visible', timeout: 5000 });
        return caixa;
    }

    private async buscarInputEmail(): Promise<Locator> {
        const input = this.page.locator(idsCss.email);
        await input.waitFor({ state: 'visible', timeout: 5000 });
        return input;
    }

    private async buscarInputSenha(): Promise<Locator> {
        const input = this.page.locator(idsCss.senha);
        await input.waitFor({ state: 'visible', timeout: 5000 });
        return input;
    }
}