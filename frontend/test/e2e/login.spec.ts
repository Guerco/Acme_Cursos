import { test } from 'playwright/test';
import { TelaLogin } from './telas/TelaLogin';

test.describe( 'Login', () => {
    let tela: TelaLogin;

    test.beforeEach(async ({ page }) => {
        tela = new TelaLogin(page);

        // Dado que acesso a tela inicial
        await tela.acessar();
        //     Quando clico em entrar
        await tela.clicarEntrar();
    });

    // Cenário: Caixa de credenciais abre ao clicar em entrar
    test( 'Caixa login abre', async () => {
        //     Então a caixa de credenciais se abre.
        await tela.deveExibirCaixaCredenciais();
    });

    // Cenário: Caixa de credenciais informa ao preencher credenciais erradas
    test( 'Credenciais inválidas', async () => {
        //     Quando preencho credenciais incorretas na tela que se abre
        await tela.preencherCredenciais(
            'email@invalido.com',
            'vasco-da-gama123',
        );
        //          E clico em enviar
        await tela.clicarEnviarLogin();
        //     Então a uma mensagem é exibida informando que as credenciais são inválidas.
        await tela.deveExibirMensagemCredenciais();
        
    });
    
    // Cenário: Caixa de credenciais fecha ao informar credenciais corretas
    test( 'Credenciais válidas', async () => {
        //     Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais(
            'aluno@email.com',
            '123',
        );
        // E clico em enviar
        await tela.clicarEnviarLogin();
        // Então a caixa de credenciais se fecha.
        await tela.deveFecharCaixaCredenciais();
    });

    // Cenário: Nome do usuário é preenchido ao informar credenciais corretas
    test( 'Preenche nome do usuário', async () => {
        //     Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais(
            'aluno@email.com',
            '123',
        );
        // E clico em enviar
        await tela.clicarEnviarLogin();
        // Então a caixa de credenciais se fecha.
        await tela.deveExibirNomeNoCabecalho('Aluno');
    });

    
    // Cenário: Login exige email em formato correto
    test( 'Email inválido', async () => {
        //     Quando preencho um email com formato incorreto
        await tela.preencherCredenciais(
            'emailinvalido',
            'vasco-da-gama123',
        );
        // E clico em enviar
        await tela.clicarEnviarLogin();
        // Então o form não vai aceitar aquele campo.
        await tela.deveInvalidarEmail();
    });
});