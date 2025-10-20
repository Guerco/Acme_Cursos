import { Page, expect, Locator } from 'playwright/test';
import { ids } from '../../../src/ui/quiz-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.quiz;

export class TelaQuiz { 
    constructor(
        private page: Page
    ){}

    // Interação com a tela
    async acessar(){
        await this.page.goto(URL);
    }

    private buscarCaixaCredencial(): Locator{
        return this.page.locator(`#${ids.dialogCredenciais}`);
    }

    // Expects
    async exigeCredenciais(){
        const caixaCredenciais = this.buscarCaixaCredencial();
        expect(await caixaCredenciais.count()).toBeGreaterThanOrEqual(1);
    }

    async preencherCredenciais(email : string, senha : string){
        const caixaCredenciais = this.buscarCaixaCredencial();
        const inputEmail = caixaCredenciais.locator(`#${ids.inputEmail}`);
        await inputEmail.fill(email);
        const inputSenha = caixaCredenciais.locator(`#${ids.inputSenha}`);
        await inputSenha.fill(senha);
    }

    async clicarEnviarCredenciais(){
        const caixaCredenciais = this.buscarCaixaCredencial();
        const enviar = caixaCredenciais.locator(`#${ids.botaoEnviar}`);
        await enviar.click();
    }

    async caixaCredenciaisFechada(){
        const caixaCredenciais = this.buscarCaixaCredencial();
        await expect(caixaCredenciais).not.toHaveAttribute('open', '');
    }

    async deveExibirCredenciaisInvalidas() {
        const caixaCredenciais = this.buscarCaixaCredencial();
        await expect(caixaCredenciais).toContainText('Credenciais Inválidas');
    }
}