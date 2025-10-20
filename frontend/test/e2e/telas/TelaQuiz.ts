import { Page, expect, Locator } from 'playwright/test';
import { ids, classes } from '../../../src/ui/quiz-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.quiz;

export class TelaQuiz { 
    constructor(
        private page: Page
    ){}

    // Interação com a tela
    async acessar(){
        await this.page.goto(`${URL}?assunto=3`);
    }

    private async buscarCaixaCredencial(): Promise<Locator>{
        return await this.page.locator(`#${ids.dialogCredenciais}`);
    }

    // Expects
    async exigeCredenciais(){
        const caixaCredenciais = await this.buscarCaixaCredencial();
        expect(await caixaCredenciais.count()).toBeGreaterThanOrEqual(1);
    }

    async preencherCredenciais(email : string, senha : string){
        const caixaCredenciais = await this.buscarCaixaCredencial();
        const inputEmail = caixaCredenciais.locator(`#${ids.inputEmail}`);
        await inputEmail.fill(email);
        const inputSenha = caixaCredenciais.locator(`#${ids.inputSenha}`);
        await inputSenha.fill(senha);
    }

    async clicarEnviarCredenciais(){
        const caixaCredenciais = await this.buscarCaixaCredencial();
        const enviar = caixaCredenciais.locator(`#${ids.botaoEnviar}`);
        await enviar.click();
    }

    async caixaCredenciaisFechada(){
        const caixaCredenciais = await this.buscarCaixaCredencial();
        await expect(caixaCredenciais).not.toHaveAttribute('open', '');
    }

    async deveExibirCredenciaisInvalidas() {
        const caixaCredenciais = await this.buscarCaixaCredencial();
        await expect(caixaCredenciais).toContainText('Credenciais Inválidas');
    }

    async deveExibirPergunta() {
        const pergunta = await this.page.locator(`.${classes.pergunta}`);
        await pergunta.waitFor({ state: 'visible', timeout: 5000 });
        await expect(pergunta).toBeVisible();
    }
}