import { test } from 'playwright/test';
import { TelaCadastroUsuario } from './telas/TelaCadastroUsuario';

test.describe('Cadastro de Usuário', () => {
    let tela: TelaCadastroUsuario;

    test.beforeEach(async ({ page }) => {
        tela = new TelaCadastroUsuario(page);
        // Dado que acesso a tela de cadastro de usuários
        await tela.acessar();
    });

    // Cenário: Mostra a lista de tipos de usuários
    test('Preenche a lista de tipos de usuários', async () => {
        // Quando visualizo a tela
        // Então lista o tipo de usuário Aluno, Professor e Administrador
        await tela.deveListarTiposUsuario();
    });

    // Cenário: Mostra a senha
    test('Mostra a senha', async () => {
        // Quando clico no botão do emoji
        await tela.clicarBotaoSenha();
        // A senha deve ficar visível;
        await tela.deveMostrarSenha();
    });

    // Cenário: Esconde a senha   
    test('Esconde a senha', async () => {
        // E a senha está visível
        await tela.clicarBotaoSenha();;
        await tela.deveMostrarSenha();

        // Quando clico no botão do emoji
        await tela.clicarBotaoSenha();
        // A senha deve ficar escondida novamente;
        await tela.deveEsconderSenha();
    });

    // Cenário: Cadastro exige um tamanho mínimo para o nome
    test('Tamanho mínimo do nome', async () => {
        // Quando tento preencher o nome com menos de 2 caracteres
        // Então o campo não vai aceitar essa quantidade.
        await tela.nomeTamanhoMinimo('A');
    });

    // Cenário: Cadastro exige um tamanho máximo para o nome
    test('Tamanho máximo do nome', async () => {
        // Quando tento preencher o nome com mais de 100 caracteres
        // Então o campo não vai aceitar essa quantidade.
        await tela.nomeTamanhoMaximo('A'.repeat(101));
    });

    // Cenário: Cadastro exige um tamanho mínimo para o email
    test('Tamanho mínimo do email', async () => {
        //  Quando tento preencher o email com menos de 3 caracteres
        // Então o campo não vai aceitar essa quantidade.
        await tela.emailTamanhoMinimo('a@');
    });

    // Cenário: Cadastro exige um tamanho máximo para o email
    test('Tamanho máximo do email', async () => {
        // Quando tento preencher o email com mais de 100 caracteres
        // Então o campo não vai aceitar essa quantidade.
        await tela.emailTamanhoMaximo('a'.repeat(101));
    });

    // Cenário: Cadastro exige um tamanho mínimo para a senha
    test('Tamanho mínimo da senha', async () => {
        // Quando tento preencher uma senha com menos de 6 caracteres
        // Então o campo não vai aceitar essa quantidade.
        await tela.senhaTamanhoMinimo('12345');
    });

});
