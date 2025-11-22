import { test, expect, Page } from 'playwright/test';
import { TelaQuiz } from './telas/TelaQuiz';
import { entrar } from './telas/entrar';


test.describe('Quiz', () => {
    let tela: TelaQuiz;

    test.beforeEach(async ({ page }) => {
        tela = new TelaQuiz(page);   

        await entrar(
            page,
            'aluno@email.com',
            '123'
        )

        // Dado que acesso a tela de quiz
        await tela.acessar();
    });


    //Cenário: Pergunta é exibida ao informar  as credenciais
    test('Pergunta é exibida', async () => {
        // E clico em iniciar quiz
        await tela.clicarIniciarQuiz();
        // Então uma pergunta é exibida na tela de quiz.
        await tela.deveExibirPergunta();

    });

    // Cenário: Informações do aluno são exibidas
    test('Informações do aluno são exibidas', async () => {
        // E clico em iniciar quiz
        await tela.clicarIniciarQuiz();
        // Então o cabeçalho exibe A pontuação geral do aluno
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
            await execa`pnpm run db`;
        } catch (err : any) {
            console.error(err.message);
        }

        tela = new TelaQuiz(page);
    });

    // Cenário: Quiz reconhece respostas corretas
    test('Resposta certa é reconhecida.', async ({ page }) => {
        await entrar(
            page,
            'aluno@email.com',
            '123'
        );

        // Dado que acesso a tela de quiz
        await tela.acessarQuizFracao();
        
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
    test('Resposta incorreta é reconhecida', async ({ page }) => {
        await entrar(
            page,
            'aluno@email.com',
            '123'
        );

        // Dado que acesso a tela de quiz
        await tela.acessarQuizFracao();

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
    test('Quiz Apresenta mensagem quando acaba as perguntas', async ({ page }) => {
        await entrar(
            page,
            'aluno2@email.com',
            '123'
        );

        // Dado que acesso a tela de quiz
        await tela.acessarQuizFracao();

        // Se não houver mais perguntas para aquele quiz
        // Então uma mensagem é exibida informando que não há mais perguntas.
        await tela.deveExibirNaoHaPerguntas();
    });

    // Cenário: Quiz se encerra ao sair de tela cheia
    test('Quiz se encerra quando sai de tela cheia', async ({ page }) => {
        await entrar(
            page,
            'aluno@email.com',
            '123'
        );

        // Dado que acesso a tela de quiz
        await tela.acessarQuizFracao();
        
        // E clico em iniciar quiz
        await tela.clicarIniciarQuiz();
        // E aperto esc para sair de tela cheia
        await tela.sairDeTelaCheia();
        // Então uma mensagem é exibida informando que o quiz se encerrou.
        await tela.deveExibirMensagemQuizEncerrado();
    });
});