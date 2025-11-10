import { rotasPaginas } from "../rotas.ts";

export class VisaoErroDOM {
    private mensagemPadrao = 'Sentimos muito, ocorreu um problema inesperado...';

    iniciar() {
        this.preencherMensagem();

        const botao = document.querySelector('button');
        botao!.addEventListener('click', () => this.irParaPaginaInicial());
    }

    // Métodos de Entrada
    private buscarMensagem () : string{
        const params = new URLSearchParams(window.location.search);
        const mensagem = params.get('msg');

       return mensagem
            ? decodeURIComponent(mensagem)
            : this.mensagemPadrao;
    } 

    // Métodos de Saída
    private preencherMensagem() {
        const mensagem = this.buscarMensagem();
        const output = document.querySelector('output');
        output!.innerText = mensagem;
    }

    private irParaPaginaInicial() {
        location.href = rotasPaginas.listagemCursos;
    }
}