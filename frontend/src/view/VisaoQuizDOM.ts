import { VisaoQuiz } from "./VisaoQuiz.ts";
import { ControladoraQuiz } from "../presenter/ControladoraQuiz.ts"
import { rotasPaginas } from "../rotas.ts";
import { AlunoListagem } from "../model/dto/AlunoListagem.ts";
import { Credenciais } from "../model/dto/Credenciais.ts";
import { ids } from "../ui/quiz-ui.ts";

export class VisaoQuizDOM implements VisaoQuiz{
    private controladora: ControladoraQuiz
    private modal!: HTMLDialogElement;

    constructor() {
        this.controladora = new ControladoraQuiz(this);
    }

    iniciar(): void{
        this.modal = document.getElementById(ids.dialogCredenciais) as HTMLDialogElement;
        this.modal.showModal();

        const botaoCancelar = document.getElementById(ids.cancelarCredenciais) as HTMLButtonElement;
        botaoCancelar!.addEventListener('click', (event) => {
            this.controladora.redirecionarParaCursos();
        });

        this.modal.addEventListener('submit', (event) => {
            event.preventDefault();

            this.controladora.verificarCredenciais();
        });
    }

    // Entradas
    buscarCredenciais(): Credenciais{
        const form = document.getElementById(ids.formCredenciais) as (HTMLFormElement);
        const credenciais = Object.fromEntries(new FormData(form).entries()) as { email: string; senha: string };
        return credenciais;
    }

    // Saídas
    exibirMensagemCredenciais(mensagem: string): void {
        const out = document.querySelector(`#${ids.dialogCredenciais} output`) as HTMLOutputElement;
        out.innerText = mensagem;
    }

    fecharFormCredenciais(aluno: AlunoListagem){
        this.modal.close();
    }

    irParaPaginaCursos(): void{
        location.href = rotasPaginas.listagemCursos;
    }
}




