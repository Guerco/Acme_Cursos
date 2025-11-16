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

    async preencherNome(texto: string){
        const nome = await this.buscarNome();
        await nome.fill(texto);
    }

    async preencherEmail(texto: string){
        const email = await this.buscarEmail();
        await email.fill(texto);
    }

    async preencherSenha(texto: string){
        const senha = await this.buscarSenha();
        await senha.fill(texto);
    }

    // Expects
    async listarTiposUsuario() {
        const tipo = await this.buscarTipoUsuario();
        await expect(tipo).toHaveText(/Aluno/);
        await expect(tipo).toHaveText(/Professor/);
        await expect(tipo).toHaveText(/Administrador/);
    }

    async deveMostrarSenha() {
        const senha = await this.buscarSenha();
        await expect(senha).toHaveAttribute('type', 'text');
    }

    async deveEsconderSenha() {
        const senha = await this.buscarSenha();
        await expect(senha).toHaveAttribute('type', 'password');
    }

    async nomeTamanhoMinimo() {
        const nome = await this.buscarNome();
        await expect(nome).toHaveJSProperty('validity.valid', false);
        await expect(nome).toHaveJSProperty('validity.tooShort', true);
    }

    async nomeTamanhoMaximo() {
        const nome = await this.buscarNome();
        const valor = await nome.inputValue();
        expect(valor.length).toBe(100);
    }

    async emailTamanhoMinimo() {
        const email = await this.buscarEmail();
        await expect(email).toHaveJSProperty('validity.valid', false);
        await expect(email).toHaveJSProperty('validity.tooShort', true);
    }

    async emailTamanhoMaximo() {
        const email = await this.buscarEmail();
        const valor = await email.inputValue();
        expect(valor.length).toBe(100);
    }

    async senhaTamanhoMinimo() {
        const senha = await this.buscarSenha();
        await expect(senha).toHaveJSProperty('validity.valid', false);
        await expect(senha).toHaveJSProperty('validity.tooShort', true);
    }

    // Auxiliar

    async buscarTipoUsuario(){
        const tipo = await this.page.locator(idsCss.tipoUsuario);
        return tipo;
    }

    async buscarSenha(){
        const senha = this.page.locator(idsCss.senha);
        return senha;
    }

    async buscarNome(){
        const nome = await this.page.locator(idsCss.nome);
        return nome;
    }

    async buscarEmail(){
        const email = await this.page.locator(idsCss.email);
        return email;
    }
}