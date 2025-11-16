import { ids } from "../ui/senha-ui.ts";

export class VisaoSenhaDOM {
    private inputSenha! : HTMLInputElement;
    private botaoExibir! : HTMLButtonElement;
    


    iniciar() {
        this.carregarElementos();

        this.botaoExibir!.addEventListener('click', () => this.alternarVisibilidadeSenha());
    }

    // Métodos de Entrada

    // Métodos de Saída
    alternarVisibilidadeSenha(): void{
        const oculta = (this.botaoExibir!.innerText == '🙈');

        this.botaoExibir!.innerText = oculta ? '🐵':'🙈';
        this.inputSenha!.type = oculta ? 'text' : 'password';
    }

    // Auxiliares
    private carregarElementos() {
        this.inputSenha = document.getElementById(ids.input) as HTMLInputElement;
        this.botaoExibir = document.getElementById(ids.botao) as HTMLButtonElement;
    }
}