import { test, expect, Page } from 'playwright/test';
import { TelaQuiz } from './telas/TelaQuiz';

test.describe('Quiz', () => {
    let tela: TelaQuiz;

    test.beforeEach(async ({ page }) => {
        tela = new TelaQuiz(page);
        // Dado que acesso a tela de quiz
        await tela.acessar();
    });

    // Cenário: Página exige credenciais ao abrir
    test('Exige credenciais', async () => {
        // Quando visualizo a tela
        // Então há uma caixa solicitando o preenchimento das credenciais.
        await tela.exigeCredenciais();
    });

    //     Cenário: Caixa de credenciais fecha ao informar credenciais corretas
    test('Aceita Credenciais', async () => {
        // Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno@email.com', '123');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // Então a caixa de credenciais se fecha.
        await tela.deveExibirCaixaCredenciaisFechada();
    });

    // Cenário: Caixa de credenciais informa se preencher credenciais erradas
    test('Recusa Credenciais', async () => {
        // Quando preencho credenciais incorretas na tela que se abre
        await tela.preencherCredenciais('emailerrado@email.com', 'senha_incorreta');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // Então a uma mensagem é exibida informando que as credenciais são inválidas.
        await tela.deveExibirCredenciaisInvalidas();
    });

    //Cenário: Pergunta é exibida ao informar  as credenciais
    test('Pergunta é exibida', async () => {
        // Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno@email.com', '123');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // E clico em iniciar quiz
        await tela.clicarIniciarQuiz();
        // Então uma pergunta é exibida na tela de quiz.
        await tela.deveExibirPergunta();

    });

    // Cenário: Informações do aluno são exibidas
    test('Informações do aluno são exibidas', async () => {
        // Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno@email.com', '123');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // E clico em iniciar quiz
        await tela.clicarIniciarQuiz();
        // Então o cabeçalho exibe o nome do aluno
        await tela.deveExibirNomeAluno();
        // e sua pontuação geral
        await tela.deveExibirPontuacaoGeral();
        // e sua pontuação no curso em questão.  
        await tela.deveExibirPontuacaoCurso();
    });
});

test.describe('Quiz - Fração', () => {
    let tela: TelaQuiz;

    test.beforeEach(async ({ page }) => {
        const { execa } = await import('execa');
        try {
            const { stdout } = await execa`pnpm run db`;
            console.log(stdout);
        } catch (err : any) {
            console.error(err.message);
        }

        tela = new TelaQuiz(page);
        // Dado que acesso a tela de quiz
        await tela.acessarQuizFracao();
    });

    // Cenário: Quiz reconhece respostas corretas
    test('Resposta certa é reconhecida.', async () => {
        // Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno@email.com', '123');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // E clico em iniciar quiz
        await tela.clicarIniciarQuiz();
        // E seleciono as respostas corretas
        await tela.selecionarRespostasCorretasFracao();
        // E clico em responder
        await tela.clicarAcao();
        // Então uma mensagem é exibida informando que acertei.
        await tela.deveExibirMensagemResposta('acertou');
    });

    // Cenário: Quiz reconhece respostas incorretas
    test('Resposta incorreta é reconhecida', async () => {
        // Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno@email.com', '123');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // E clico em iniciar quiz
        await tela.clicarIniciarQuiz();
        // E seleciono respostas incorretas
        await tela.selecionarRespostasErradasFracao();
        // E clico em responder
        await tela.clicarAcao();
        // Então uma mensagem é exibida informando que errei.
        await tela.deveExibirMensagemResposta('Você errou...');
    });

    // Cenário: Apresenta mensagem quando acaba as perguntas
    test('Quiz Apresenta mensagem quando acaba as perguntas', async () => {
        // Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno2@email.com', '123');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // Se não houver mais perguntas para aquele quiz
        // Então uma mensagem é exibida informando que não há mais perguntas.
        await tela.deveExibirNaoHaPerguntas();
    });

    // Cenário: Quiz se encerra ao sair de tela cheia
    test('Quiz se encerra quando sai de tela cheia', async () => {
        // Quando preencho credenciais corretas na tela que se abre
        await tela.preencherCredenciais('aluno@email.com', '123');
        // E clico em enviar
        await tela.clicarEnviarCredenciais();
        // E clico em iniciar quiz
        await tela.clicarIniciarQuiz();
        // E aperto esc para sair de tela cheia
        await tela.sairDeTelaCheia();
        // Então uma mensagem é exibida informando que o quiz se encerrou.
        await tela.deveExibirMensagemQuizEncerrado();
    });
});