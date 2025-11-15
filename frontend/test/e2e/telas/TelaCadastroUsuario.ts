import { Page, expect } from 'playwright/test';
import { rotasPaginas } from '../../../src/rotas';
import { idsCss } from '../../../src/ui/cadastro-usuario-ui';

export class TelaCadastroUsuario {

    constructor(private page: Page) {}

    // Interação com a tela
    async acessar() {
        await this.page.goto(rotasPaginas.cadastroUsuario);
    }

    async clicarBotaoSenha() {
        const botaoSenha = await this.page.locator(idsCss.exibirSenha);
        await botaoSenha.click();
    }

    async clicarBotaoEnviar() {
        const botaoCadastrar = await this.page.locator(idsCss.cadastrar);
        await botaoCadastrar.click();
    }

    // Expects
    async deveListarTiposUsuario() {
        const tipo = await this.page.locator(idsCss.tipoUsuario);
        await expect(tipo).toHaveText(/Aluno/);
        await expect(tipo).toHaveText(/Professor/);
        await expect(tipo).toHaveText(/Administrador/);
    }

    async deveMostrarSenha() {
        const senha = this.page.locator(idsCss.senha);
        await expect(senha).toHaveAttribute('type', 'text');
    }

    async deveEsconderSenha() {
        const senha = this.page.locator(idsCss.senha);
        await expect(senha).toHaveAttribute('type', 'password');
    }

    async nomeTamanhoMinimo(texto: string) {
        const nome = await this.page.locator(idsCss.nome);
        await nome.fill(texto);
        await this.clicarBotaoEnviar();
        const mensagem = this.page.locator(idsCss.mensagem);
        await expect(mensagem).toContainText('O nome deve ter de 2 a 100 caracteres');
    }

    async nomeTamanhoMaximo(texto: string) {
        const nome = await this.page.locator(idsCss.nome);
        await nome.fill(texto);
        await expect(nome).toHaveValue(texto.substring(0, 100));
    }

    async emailTamanhoMinimo(texto: string) {
        const email = await this.page.locator(idsCss.email);
        await email.fill(texto);
        await this.clicarBotaoEnviar();
        const mensagem = this.page.locator(idsCss.mensagem);
        await expect(mensagem).toContainText('Formato do email inválido.');
    }

    async emailTamanhoMaximo(texto: string) {
        const email = await this.page.locator(idsCss.email);
        await email.fill(texto);
        await expect(email).toHaveValue(texto.substring(0, 100));
    }

    async senhaTamanhoMinimo(texto: string) {
        const senha = this.page.locator(idsCss.senha);
        await senha.fill(texto);
        await this.clicarBotaoEnviar();
        const mensagem = this.page.locator(idsCss.mensagem);
        await expect(mensagem).toContainText('A senha deve conter no mínimo 6 caracteres');
    }
}
