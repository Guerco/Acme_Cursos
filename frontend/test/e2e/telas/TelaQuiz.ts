import { Page, expect, Locator } from 'playwright/test';
import { ids, classes } from '../../../src/ui/quiz-ui';
import { rotasPaginas } from '../../../src/rotas';

const URL = rotasPaginas.quiz;

export class TelaQuiz {
    constructor(private page: Page) { }

    // Interação com a tela
    async acessar() {
        await this.page.goto(`${URL}?assunto=3`);
    }

    async acessarQuizFracao() {
        await this.page.goto(`${URL}?assunto=4`);
    }

    async selecionarRespostasCorretasFracao() {
        const respostaCorreta = this.page.locator(`.${classes.resposta}[data-id="13"]`).first();
        await respostaCorreta.waitFor({ state: 'visible', timeout: 5000 });
        await respostaCorreta.click();
    }

    async selecionarRespostasErradasFracao() {
        const respostaErrada = this.page.locator(`.${classes.resposta}[data-id="12"]`).first();
        await respostaErrada.waitFor({ state: 'visible', timeout: 5000 });
        await respostaErrada.click();
    }

    async clicarAcao() {
        const botaoResponder = this.page.locator(`#${ids.botaoAcao}`);
        await botaoResponder.waitFor({ state: 'visible', timeout: 5000 });
        await botaoResponder.click();
    }

    async clicarIniciarQuiz() {
        const botaoIniciar = this.page.locator(`.${classes.botaoIniciarQuiz}`);
        await botaoIniciar.waitFor({ state: 'visible', timeout: 5000 });
        await botaoIniciar.click();
    }

    async sairDeTelaCheia() {
        const pergunta = this.page.locator(`.${classes.pergunta}`);
        await pergunta.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.evaluate(() => {
            document.exitFullscreen();
        });
    }

    // Expects
    async deveExibirPergunta() {
        const pergunta = this.page.locator(`.${classes.pergunta}`);
        await pergunta.waitFor({ state: 'visible', timeout: 5000 });
        await expect(pergunta).toBeVisible();
    }

    async deveExibirMensagemResposta(mensagem: string) {
        const mensagemResposta = this.page.locator(`#${ids.mensagemResposta}`);
        await mensagemResposta.waitFor({ state: 'visible', timeout: 5000 });
        await expect(mensagemResposta).toContainText(mensagem);
    }

    async deveExibirNomeAluno() {
        const nome = this.page.locator(`#${ids.usuario}`);
        await nome.waitFor({ state: 'visible', timeout: 5000 });
        await expect(nome).toHaveText("Aluno");
    }

    async deveExibirPontuacaoGeral() {
        const pontuacaoGeral = this.page.locator(`label[for="${ids.pontuacaoGeral}"]`);
        await pontuacaoGeral.waitFor({ state: 'visible', timeout: 5000 });
        await expect(pontuacaoGeral).toHaveText('🏆 Geral');
    }

    async deveExibirPontuacaoCurso() {
        const pontuacaoCurso = this.page.locator(`label[for="${ids.pontuacaoCurso}"]`);
        await pontuacaoCurso.waitFor({ state: 'visible', timeout: 5000 });
        await expect(pontuacaoCurso).toHaveText('🎯 Curso');
    }

    async deveExibirNaoHaPerguntas() {
        const mensagemFim = this.page.locator(`.${classes.mensagemFim}`);
        await mensagemFim.waitFor({ state: 'visible', timeout: 5000 });
        expect(mensagemFim).toContainText('Não há perguntas restantes');
    }

    async deveExibirMensagemQuizEncerrado() {
        const mensagemFim = this.page.locator(`.${classes.mensagemFim}`);
        await mensagemFim.waitFor({ state: 'visible', timeout: 5000 });
        expect(mensagemFim).toContainText('saiu do quiz');
    }
}
