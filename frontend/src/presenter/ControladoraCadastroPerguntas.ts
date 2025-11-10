import { RepositorioProfessoresJsonServer } from "../model/repositorio/RepositorioProfessoresJsonServer";
import { RepositorioCursosJson } from "../model/repositorio/RepositorioCursosJson";
import { ServicoCadastroPerguntas } from "../model/servico/ServicoCadastroPerguntas";
import { VisaoCadastroPerguntas } from "../view/VisaoCadastroPerguntas";
import { RepositorioAssuntosJson } from "../model/repositorio/RepositorioAssuntosJson";
import { RepositorioPerguntasJsonServer } from "../model/repositorio/RepositorioPerguntasJsonServer";

export class ControladoraCadastroPerguntas {
    private servico: ServicoCadastroPerguntas;

    constructor(
        private visao: VisaoCadastroPerguntas
    ) {
        const repoProfessores = new RepositorioProfessoresJsonServer();
        const repoCursos = new RepositorioCursosJson();
        const repoAssuntos = new RepositorioAssuntosJson();
        const repoPerguntas = new RepositorioPerguntasJsonServer();
        this.servico = new ServicoCadastroPerguntas(repoProfessores, repoCursos, repoAssuntos, repoPerguntas);
    }

    async carregarProfessores(): Promise<void> {
        try {
            const professores = await this.servico.buscarProfessores();
            this.visao.preencherListaProfessores(professores);
        } catch (err: any) {
            throw err;
        }
    };

    async carregarCursos(): Promise<void> {
        try {
            const idProfessor = this.visao.buscarIdProfessorSelecionado();
            const cursos = await this.servico.buscarCursosProfessor(idProfessor);
            this.visao.preencherListaCursos(cursos);
            this.visao.habilitarSelecaoCursos();
        } catch (err: any) {
            throw err;
        }
    }

    async carregarAssuntos(): Promise<void> {
        try {
            const idCurso = this.visao.buscarIdCursoSelecionado();
            const assuntos = await this.servico.buscarAssuntosCurso(idCurso);
            this.visao.preencherListaAssuntos(assuntos);
            this.visao.habilitarSelecaoAssuntos();
        } catch (err: any) {
            throw err;
        }
    }

    limparAssuntos(): void {
        this.visao.preencherListaAssuntos([]);
        this.visao.desabilitarSelecaoAssuntos();
    }

    adicionarResposta(): void {
        this.visao.habilitarProximaResposta();
        this.visao.atualizarBotoesRespostas();
    }

    removerResposta(): void {
        this.visao.desabilitarUltimaResposta();
        this.visao.atualizarBotoesRespostas();
        this.verificarQtdRespostasCorretas();
    }

    alternarRespostaCorreta(event: Event): void {
        const qtdRespostas = this.visao.buscarQtdRespostas();
        if (qtdRespostas == 2) {
            this.visao.desmarcarTodasRespostasCorretas();
            this.visao.marcarRespostaCorreta(event.target as HTMLInputElement);
        } else this.verificarQtdRespostasCorretas(qtdRespostas, event.target as HTMLInputElement);
    }

    verificarQtdRespostasCorretas(qtdRespostas? : number, caixaClicada? : HTMLInputElement) : void {
        const qtdCorretas = this.visao.buscarQtdRespostasCorretas();

        if (qtdCorretas == 0) {
            if (caixaClicada) this.visao.marcarRespostaCorreta(caixaClicada);
            else this.visao.marcarPrimeiraRespostaCorreta();
        } else if (qtdCorretas == (qtdRespostas ?? this.visao.buscarQtdRespostas())) {
            if (caixaClicada) this.visao.desmarcarRespostaCorreta(caixaClicada);
            else this.visao.desmarcarUltimaRespostaCorreta();
        }
    }

    async salvarPergunta(event: Event) {
        try {
            event.preventDefault();
            const pergunta = await this.visao.buscarDadosPergunta();
            await this.servico.cadastrarPergunta(pergunta);
            this.visao.exibirMensagemSucesso();
        } catch (err : any) {
            this.visao.exibirMensagemErro(err.message);
        }
    }
}