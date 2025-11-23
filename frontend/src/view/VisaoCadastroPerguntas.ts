import { CursoListagemResumo } from "../model/dto/CursoListagemResumo";
import { ProfessorListagem } from "../model/dto/ProfessorListagem";
import { AssuntoListagem } from "../model/dto/AssuntoListagem";
import { PerguntaCadastro } from "../model/dto/PerguntaCadastro";
import { VisaoBase } from "./VisaoBase";

export interface VisaoCadastroPerguntas extends VisaoBase{
    iniciar(): Promise<void>;

    // Métodos de Entrada
    buscarIdProfessorSelecionado(): number;
    buscarIdCursoSelecionado(): number;
    buscarQtdRespostas() : number;
    buscarQtdRespostasCorretas() : number;
    buscarDadosPergunta(): Promise<PerguntaCadastro>;

    // Métodos de Saída
    preencherListaProfessores(professores: ProfessorListagem[]): void;
    preencherListaCursos(cursos: CursoListagemResumo[]): void;
    habilitarSelecaoCursos(): void;
    preencherListaAssuntos(assuntos: AssuntoListagem[]): void;
    limparListaAssuntos(): void;
    habilitarSelecaoAssuntos(): void;
    desabilitarSelecaoAssuntos(): void;
    habilitarProximaResposta(): void;
    atualizarBotoesRespostas(): void;
    desabilitarUltimaResposta(): void;
    desmarcarTodasRespostasCorretas() : void;
    marcarRespostaCorreta(caixaCorreta : HTMLInputElement) : void;
    desmarcarUltimaRespostaCorreta() : void;
    desmarcarRespostaCorreta(caixaCorreta : HTMLInputElement) : void;
    marcarPrimeiraRespostaCorreta() : void;
    exibirMensagemErro(mensagens: string[]) : void
    exibirMensagemSucesso() : void;
}
