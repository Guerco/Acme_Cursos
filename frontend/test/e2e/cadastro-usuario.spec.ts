import { test } from 'playwright/test';
import { TelaCadastroUsuario } from './telas/TelaCadastroUsuario';
import { entrar } from './telas/entrar';

test.describe('Cadastro de Usuário', () => {
    let tela: TelaCadastroUsuario;

    test.beforeEach(async ({ page }) => {

        await entrar(
                    page,
                    'adm@email.com',
                    '123'
                );
                
        tela = new TelaCadastroUsuario(page);
        // Dado que acesso a tela de cadastro de usuários
        await tela.acessar();
    });

    // Cenário: Mostra a lista de tipos de usuários
    test('Preenche a lista de tipos de usuários', async () => {
        // Quando clico no tipo usuario
        // Então lista o tipo de usuário Aluno, Professor e Administrador
        await tela.listarTiposUsuario();
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
        await tela.preencherNome('A');
        // E clico no botão enviar
        await tela.clicarBotaoEnviar();
        // Então o campo não vai aceitar essa quantidade.
        await tela.nomeTamanhoMinimo();
    });

    // Cenário: Cadastro exige um tamanho máximo para o nome
    test('Tamanho máximo do nome', async () => {
        // Quando tento preencher o nome com mais de 100 caracteres
        await tela.preencherNome('A'.repeat(101));
        // Então o campo não vai aceitar essa quantidade.
        await tela.nomeTamanhoMaximo();
    });

    // Cenário: Cadastro exige um tamanho mínimo para o email
    test('Tamanho mínimo do email', async () => {
        //  Quando tento preencher o email com menos de 3 caracteres
        await tela.preencherEmail('a@');
        // E clico no botão enviar
        await tela.clicarBotaoEnviar();
        // Então o campo não vai aceitar essa quantidade.
        await tela.emailTamanhoMinimo();
    });

    // Cenário: Cadastro exige um tamanho máximo para o email
    test('Tamanho máximo do email', async () => {
        // Quando tento preencher o email com mais de 100 caracteres
        await tela.preencherEmail('a'.repeat(101));
        // Então o campo não vai aceitar essa quantidade.
        await tela.emailTamanhoMaximo();
    });

    // Cenário: Cadastro exige um tamanho mínimo para a senha
    test('Tamanho mínimo da senha', async () => {
        // Quando tento preencher uma senha com menos de 6 caracteres
        await tela.preencherSenha('12345');
        // E clico no botão enviar
        await tela.clicarBotaoEnviar();
        // Então o campo não vai aceitar essa quantidade.
        await tela.senhaTamanhoMinimo();
    });

});
