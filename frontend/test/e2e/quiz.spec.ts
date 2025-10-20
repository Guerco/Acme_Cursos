





import { test, expect, Page  } from 'playwright/test';
import { TelaQuiz } from './telas/TelaQuiz';

test.describe( 'Quiz', () => {
    let tela: TelaQuiz;

    test.beforeEach(async ({ page }) => {
        tela = new TelaQuiz(page);
        // Dado que acesso a tela de quiz
        await tela.acessar();
    });

    // Cenário: Página exige credenciais ao abrir
    test( 'Exige credenciais', async () => {
        // Quando visualizo a tela
        // Então há uma caixa solicitando o preenchimento das credenciais.
        await tela.exigeCredenciais();
    });
    
    //     Cenário: Caixa de credenciais fecha ao informar credenciais corretas
    test( 'Aceita Credenciais', async () => {
        // Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno@email.com', '123');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // Então a caixa de credenciais se fecha.
        await tela.caixaCredenciaisFechada();
    });

    // Cenário: Caixa de credenciais informa se preencher credenciais erradas
    test( 'Recusa Credenciais', async () => {
        // Quando preencho credenciais incorretas na tela que se abre
        await tela.preencherCredenciais('emailerrado@email.com', 'senha_incorreta');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // Então a uma mensagem é exibida informando que as credenciais são inválidas.
        await tela.deveExibirCredenciaisInvalidas();
    });

    //Cenário: Pergunta é exibida ao informar  as credenciais
    test('Pergunta é exibida', async () => {
        //Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno@email.com', '123');
        //E clico em enviar
        await tela.clicarEnviarCredenciais();
        //Então uma pergunta é exibida na tela de quiz.
        await tela.deveExibirPergunta();

    });
        

});