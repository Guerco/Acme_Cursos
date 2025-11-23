import { test } from 'playwright/test';
import { TelaCadastroPerguntas } from './telas/TelaCadastroPerguntas';
import { entrar } from './telas/entrar';

test.describe('Cadastro de Perguntas', () => {
    let tela: TelaCadastroPerguntas;

    test.beforeEach(async ({ page }) => {
        tela = new TelaCadastroPerguntas(page);

        await entrar(
                            page,
                            'adm@email.com',
                            '123'
                        )
        // Dado que acesso a tela de cadastro de pergunta
        await tela.acessar();
    });

    // Cenário: Cadastro preenche a lista de professores ao abrir
    test('Lista pelo menos um professor na seleção', async () => {
        // Quando visualizo a tela
        // Então há pelo menos um professor listado na seleção.
        await tela.deveListarProfessorNaSelecao();
    });

    // Cenário: Cadastro preenche a lista de cursos ao selecionar o professor
    test('Lista pelo menos um curso na seleção', async () => {
        // Quando seleciono um professor
        await tela.selecionarPrimeiroProfessor();
        // Então a seleção de cursos é habilitada
        await tela.deveHabilitarSelecaoCursos();
        // E há pelo menos um curso listado na seleção.
        await tela.deveListarCursoNaSelecao();
    });

    // Cadastro preenche a lista de assuntos ao selecionar o curso
    test('Lista pelo menos um assunto na seleção', async () => {
        // Quando seleciono um professor
        await tela.selecionarPrimeiroProfessor();
        // e seleciono um curso
        await tela.selecionarPrimeiroCurso();
        // Então a seleção de assuntos é habilitada
        await tela.deveHabilitarSelecaoAssuntos();
        // E há pelo menos um assunto listado na seleção.
        await tela.deveListarAssuntoNaSelecao();
    });

    // Cenário: Cadastro permite a seleção de dificuldade
    test('Exibe seleção de dificuldade', async () => {
        // Quando visualizo a tela
        // Então há uma seleção de nível de dificuldade
        await tela.deveExibirSelecaoDificuldade();
        // E há as opções Fácil, Médio e Difícil.
        await tela.deveHaverOpcoesFacilMedioDificil();
    });

    // Cenário: Cadastro permite aumentar o número de respostas
    test('Adicona nova resposta', async () => {
        // Quando clico em adicionar resposta
        await tela.clicarAdicionarResposta();
        // Então a terceira caixa de resposta fica visível.
        await tela.deveExibirTerceiraCaixaDeResposta();
    });

    // Cenário: Cadastro permite no máximo cinco respostas
    test('Limita quantidade máxima de respostas', async () => {
        // Quando clico em adicionar resposta três vezes
        await tela.clicarAdicionarResposta();
        await tela.clicarAdicionarResposta();
        await tela.clicarAdicionarResposta();
        // Então o botão de adicionar resposta é desabilitado.
        await tela.deveDesabilitarBotaoAdicionarResposta();
    });

    // Cenário: Cadastro permite no mínimo duas respostas
    test('Limita quantidade mínima de respostas', async () => {
        // Quando visualizo a tela
        // Então o botão de remover resposta é desabilitado.
        await tela.deveDesabilitarBotaoRemoverResposta();
    });

    // Cenário: Cadastro permite diminuir o número de respostas
    test('Remove última resposta visível', async () => {
        // Quando clico em adicionar resposta
        await tela.clicarAdicionarResposta();
        //      e clico em remover resposta
        await tela.clicarRemoverResposta();
        // Então a terceira caixa de resposta fica invisível.
        await tela.deveOcultarTerceiraCaixaDeResposta();
    });

    // Cenário: Cadastro exige no mínimo uma resposta correta
    test('Não desmarca única resposta correta', async () => {
        //     E apenas a resposta um está marcada como correta
        //  Quando tento desmarcar essa resposta
        await tela.alternarRespostaCorreta(0);
        //  Então a resposta permanece marcada como correta.
        await tela.deveMarcarPrimeiraRespostaCorreta();
    });

    // Cadastro impede marcar todas as respostas como corretas
    test('Desmarca primeira resposta para evitar todas corretas', async () => {
        //    E apenas a resposta um está marcada como correta
        // Quando eu marco a segunda resposta como correta
        await tela.alternarRespostaCorreta(1);
        // Então a resposta um é desmarcada.
        await tela.deveDesmarcarPrimeiraRespostaCorreta();
    });

    // Cenário: Cadastro permite preencher o enunciado
    test('Exibe campo enunciado', async () => {
        // Quando visualizo a tela
        // Então há um campo para preencher o enunciado da pergunta.
        await tela.deveExibirCampoEnunciado();
    });

    // Cenário: Cadastro limita tamanho máximo do enunciado
    test('Limita tamanho máximo enunciado', async () => {
        const tamanhoMax = 255;
        const texto256Caracteres = 'x'.repeat(256);
        // Quando tento preencher o enunciado com mais de 255 caracteres
        await tela.preencherEnunciadoComTexto(texto256Caracteres);
        // Então o campo não aceita mais caracteres além do máximo.
        await tela.deveExibirEnunciadoComTamanho(tamanhoMax);
    });
});