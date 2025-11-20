import { ids } from "../ui/senha-ui.ts";

export class VisaoSenhaDOM {
    private inputSenha! : HTMLInputElement;
    private botaoExibir! : HTMLButtonElement;
    


    iniciar() {
        const botoesExibir = document.getElementsByClassName('botao-exibir-senha');

        for(const b of botoesExibir) {
            b!.addEventListener('click', (e) => this.alternarVisibilidadeSenha(e));
        }
    }

    // Métodos de Entrada

    // Métodos de Saída
    alternarVisibilidadeSenha(e : Event): void{
        const botao = e.target as HTMLButtonElement;
        const input = botao.parentElement!.querySelector('.input-senha') as HTMLInputElement;

        const oculta = (botao!.innerText == '🙈');

        botao!.innerText = oculta ? '🐵':'🙈';
        botao!.title = oculta ? 'Ocultar Senha':'Exibir Senha';
        input!.type = oculta ? 'text' : 'password';
    }
}