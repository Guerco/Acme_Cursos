import { ProfessorListagem } from "../model/dto/ProfessorListagem";
import { ControladoraCadastroPerguntas } from "../presenter/ControladoraCadastroPerguntas";
import { UtilDOM } from "../util/UtilDOM";
import { VisaoCadastroPerguntas } from "./VisaoCadastroPerguntas";
import { classes, classesCss, ids, names } from "../ui/cadastro-perguntas-ui.ts";
import { CursoListagemResumo } from "../model/dto/CursoListagemResumo.ts";
import { AssuntoListagem } from "../model/dto/AssuntoListagem.ts";
import { PerguntaCadastro } from "../model/dto/PerguntaCadastro.ts";
import { Base64 } from "../util/Base64";
import { RespostaPerguntaCadastro } from "../model/dto/RespostaPerguntaCadastro.ts";
import { rotasPaginas } from "../rotas.ts";
import { DominioException } from "../model/exception/DominioException.ts";
import { Sessao } from "../model/sessao/Sessao.ts";
import { TipoUsuario } from "../model/TipoUsuario.ts";
import { VisaoBaseDOM } from "./VisaoBaseDOM.ts";

export class VisaoCadastroPerguntasDOM extends VisaoBaseDOM implements VisaoCadastroPerguntas {
    private controladora: ControladoraCadastroPerguntas;
    private selectProfessor!: HTMLSelectElement;
    private selectCurso!: HTMLSelectElement;
    private selectAssunto!: HTMLSelectElement;
    private botaoAdicionarResposta!: HTMLButtonElement;
    private botaoRemoverResposta!: HTMLButtonElement;
    private respostas!: HTMLDivElement[];
    private caixasCorreta!: HTMLInputElement[];
    private textDescricao!: HTMLTextAreaElement;
    private selectDificuldade!: HTMLSelectElement;
    private inputFigura!: HTMLInputElement;
    private formCadastro!: HTMLFormElement;
    private mensagemErro!: HTMLOutputElement;
    private divCadastro!: HTMLDivElement;
    private inputTempoSeg!: HTMLInputElement;

    constructor(
        private sessao: Sessao
    ) {
        super();
        this.controladora = new ControladoraCadastroPerguntas(this);
    }

    async iniciar(): Promise<void> {

        if(!this.sessao.estaLogado() ||
            !this.sessao.verificarAutorizacao([
                TipoUsuario.ADMINISTRADOR,
                TipoUsuario.PROFESSOR,
                TipoUsuario.PROFESSOR_ADMINISTRADOR
            ])
        ){
            super.redirecionaParaErro('Página não encontrada ❌');
            return; 
        }

        this.carregarElementos();

        if (
            this.sessao.estaLogado()
            && this.sessao.buscarTipoUsuario() == TipoUsuario.PROFESSOR
        ) {
            this.exibirProfessorLogado();
            await this.controladora.carregarCursos();
        }
        else {
            await this.controladora.carregarProfessores();

            this.selectProfessor.addEventListener('change', async () => {
                if (this.selectProfessor.value) {
                    this.controladora.limparAssuntos();
                    await this.controladora.carregarCursos();
                }
            });
        }

        this.selectCurso.addEventListener('change', async () => {
            if (this.selectCurso.value)
                await this.controladora.carregarAssuntos();
        });

        this.botaoAdicionarResposta.addEventListener('click', () => {
            this.controladora.adicionarResposta();
        });

        this.botaoRemoverResposta.addEventListener('click', () => {
            this.controladora.removerResposta();
        });

        this.caixasCorreta.forEach(c => c.addEventListener('click', (e) => {
            this.controladora.alternarRespostaCorreta(e);
        }));

        this.formCadastro.addEventListener('submit', async (e) => {
            await this.controladora.salvarPergunta(e);
        });
    }

    // Métodos de Entrada
    buscarIdProfessorSelecionado(): number {
        return Number(this.selectProfessor.value);
    }

    buscarIdCursoSelecionado(): number {
        return Number(this.selectCurso.value);
    }

    buscarQtdRespostas(): number {
        return this.respostas.filter(r => !r.hidden).length;
    }

    buscarQtdRespostasCorretas(): number {
        return this.caixasCorreta.filter(c => (!c.disabled && c.checked)).length;
    }

    async buscarDadosPergunta(): Promise<PerguntaCadastro> {
        const idAssunto = Number(this.selectAssunto.value);
        const descricao = this.textDescricao.value.trim();
        const dificuldade = this.selectDificuldade.value;
        const tempoSeg = Number(this.inputTempoSeg.value);

        const respostas = [] as RespostaPerguntaCadastro[];

        this.respostas.filter(r => !r.hidden).forEach((r, i) => {
            const caixaCorreto = r.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const inputDescricao = r.querySelector('input[type="text"]') as HTMLInputElement;

            respostas.push(new RespostaPerguntaCadastro(
                caixaCorreto.checked,
                inputDescricao.value.trim()
            ));
        });

        let figuraBase64 = null;
        if (this.inputFigura.files && this.inputFigura.files.length > 0) {
            const arquivoFigura = this.inputFigura.files[0];
            const formatosAceitos = ['image/png', 'image/jpeg'];

            if (!formatosAceitos.includes(arquivoFigura.type)) {
                throw new DominioException('A imagem deve estar nos formatos PNG ou JPEG.');
            }

            const dataURL = await Base64.blobToDataURL(arquivoFigura);
            figuraBase64 = Base64.extractBase64FromDataURL(dataURL);
        }

        const pergunta = new PerguntaCadastro(
            idAssunto,
            descricao,
            dificuldade,
            tempoSeg,
            respostas,
            figuraBase64
        );

        return pergunta;
    }


    // Métodos de Saída
    preencherListaProfessores(professores: ProfessorListagem[]): void {
        const opcaoPadrao = this.selectProfessor.querySelector('option[value=""]') as HTMLOptionElement;
        if (professores.length === 0) opcaoPadrao.innerText = 'Não há Professores.';

        const opcoesProfessor = [opcaoPadrao!];
        for (const p of professores) {
            opcoesProfessor.push(UtilDOM.criaSelectOption(String(p.id), p.nome));
        }
        const frag = UtilDOM.criaFragmentoComElementos(opcoesProfessor);

        this.selectProfessor.innerHTML = '';
        this.selectProfessor.appendChild(frag);
    }

    preencherListaCursos(cursos: CursoListagemResumo[]): void {
        const opcaoPadrao = this.selectCurso.querySelector('option[value=""]') as HTMLOptionElement;
        opcaoPadrao.innerText = (cursos.length === 0) ? 'Este professor não possui nenhum curso.' : 'Selecione um Curso';

        const opcoesCurso = [opcaoPadrao!];
        for (const c of cursos) {
            opcoesCurso.push(UtilDOM.criaSelectOption(String(c.id), c.descricao));
        }
        const frag = UtilDOM.criaFragmentoComElementos(opcoesCurso);

        this.selectCurso.innerHTML = '';
        this.selectCurso.appendChild(frag);
    }

    habilitarSelecaoCursos(): void {
        this.selectCurso.removeAttribute('disabled');
        this.selectCurso.value = "";
    }

    preencherListaAssuntos(assuntos: AssuntoListagem[]): void {
        const opcaoPadrao = this.selectAssunto.querySelector('option[value=""]') as HTMLOptionElement;
        opcaoPadrao.innerText = (assuntos.length == 0) ? 'Este curso não possui nenhum assunto.' : 'Selecione um Assunto';

        const opcoesAssunto = [opcaoPadrao!];
        for (const c of assuntos) {   
            opcoesAssunto.push(UtilDOM.criaSelectOption(String(c.id), c.descricao));
        }
        const frag = UtilDOM.criaFragmentoComElementos(opcoesAssunto);

        this.selectAssunto.innerHTML = '';
        this.selectAssunto.appendChild(frag);
    }

    limparListaAssuntos(): void {
        const opcaoPadrao = this.selectAssunto.querySelector('option[value=""]') as HTMLOptionElement;
        opcaoPadrao.innerText = 'Selecione primeiro um Curso';

        this.selectAssunto.innerHTML = '';
        this.selectAssunto.appendChild(opcaoPadrao);
    }

    habilitarSelecaoAssuntos(): void {
        this.selectAssunto.removeAttribute('disabled');
        this.selectAssunto.value = "";
    }

    desabilitarSelecaoAssuntos(): void {
        this.selectAssunto.setAttribute('disabled', 'true');
        this.selectAssunto.value = "";
    }

    habilitarProximaResposta(): void {
        const proximaInvisivel = this.respostas.find(r => r.hidden);
        if (proximaInvisivel) {
            proximaInvisivel.hidden = false;
            (proximaInvisivel.querySelectorAll('input')).forEach(i => i.disabled = false);
        }
    }

    atualizarBotoesRespostas(): void {
        const qtdVisiveis = this.respostas.filter(r => !r.hidden).length;
        this.botaoAdicionarResposta.disabled = (qtdVisiveis >= this.respostas.length);
        this.botaoRemoverResposta.disabled = (qtdVisiveis <= 2);
    }

    desabilitarUltimaResposta(): void {
        const ultimaVisivel = this.respostas.findLast(r => !r.hidden);
        if (ultimaVisivel) {
            ultimaVisivel.hidden = true;
            (ultimaVisivel.querySelectorAll('input')).forEach(i => {
                i.disabled = true;
                if (i.type === 'checkbox') i.checked = false;
            });
        }
    }

    desmarcarTodasRespostasCorretas(): void {
        this.caixasCorreta.forEach(c => c.checked = false)
    }

    marcarRespostaCorreta(caixaCorreta: HTMLInputElement) {
        caixaCorreta.checked = true;
    };

    desmarcarUltimaRespostaCorreta(): void {
        (this.caixasCorreta.findLast(c => c.checked) as HTMLInputElement).checked = false;
    }

    desmarcarRespostaCorreta(caixaCorreta: HTMLInputElement) {
        caixaCorreta.checked = false;
    };

    marcarPrimeiraRespostaCorreta(): void {
        this.caixasCorreta[0].checked = true;
    }

    exibirMensagemErro(mensagens: string[]): void {
        this.mensagemErro.innerHTML = '';
        this.mensagemErro.classList.add(classes.destaque);
        setTimeout(() => {
            this.mensagemErro.classList.remove(classes.destaque);
        }, 500);

        for (const m of mensagens) {
            const liMensagem = UtilDOM.criaComTexto('li', m);

            this.mensagemErro.appendChild(liMensagem);
        }
    }

    exibirMensagemSucesso(): void {
        const container = UtilDOM.criaComClasses('div', [classes.containerSucesso]);
        const mensagem = UtilDOM.criaComTextoEClasses('h3', 'Pergunta cadastrada com sucesso!', [classes.mensagemSucesso]);
        const botaoVoltar = UtilDOM.criaComTextoEClasses('button', 'Ir para Cursos 🏡', [classes.botaoVoltar]);
        botaoVoltar.onclick = () => {
            window.location.href = rotasPaginas.listagemCursos;
        };
        const botaoCadastrarNova = UtilDOM.criaComTextoEClasses('button', 'Cadastrar Nova 🆕', [classes.botaoCadastrarNova]);
        botaoCadastrarNova.onclick = () => {
            window.location.href = rotasPaginas.cadastroPerguntas;
        };
        container.append(mensagem, botaoVoltar, botaoCadastrarNova);
        this.divCadastro.innerHTML = '';
        this.divCadastro.append(container);
    }

    // Auxiliares
    private carregarElementos() {
        this.selectProfessor = document.getElementById(ids.selectProfessor) as HTMLSelectElement;
        this.selectCurso = document.getElementById(ids.selectCurso) as HTMLSelectElement;
        this.selectAssunto = document.getElementById(ids.selectAssunto) as HTMLSelectElement;
        this.botaoAdicionarResposta = document.getElementById(ids.botaoAdicionarResposta) as HTMLButtonElement;
        this.botaoRemoverResposta = document.getElementById(ids.botaoRemoverResposta) as HTMLButtonElement;
        this.respostas = Array.from(document.getElementsByClassName(classes.resposta)) as HTMLDivElement[];
        this.caixasCorreta = Array.from(document.getElementsByName(names.respostaCorreta)) as HTMLInputElement[];
        this.textDescricao = document.getElementById(ids.campoDescricao) as HTMLTextAreaElement;
        this.selectDificuldade = document.getElementById(ids.selectDificuldade) as HTMLSelectElement;
        this.inputFigura = document.getElementById(ids.inputFigura) as HTMLInputElement;
        this.formCadastro = document.getElementById(ids.formCadastro) as HTMLFormElement;
        this.mensagemErro = document.getElementById(ids.mensagemCadastro) as HTMLOutputElement;
        this.divCadastro = document.getElementById(ids.cadastro) as HTMLDivElement;
        this.inputTempoSeg = document.getElementById(ids.inputTempoSeg) as HTMLInputElement;
    }

    private exibirProfessorLogado() {
        const nomeProfessor = this.sessao.buscarNomeUsuario();

        this.selectProfessor.innerHTML = '';

        const optionProfessor = UtilDOM.cria('option') as HTMLOptionElement;
        optionProfessor.value = '0';
        optionProfessor.innerText = nomeProfessor;

        this.selectProfessor.appendChild(optionProfessor);

        this.selectProfessor.disabled = true;
    }
}