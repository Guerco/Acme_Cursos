import { UsuarioCadastro } from "../model/dto/UsuarioCadastro";

export interface VisaoCadastroUsuario{

    iniciar(): void;

    //entrada
    buscaDadosUsuario(): UsuarioCadastro;

    //saida
    exibirMensagem(mensagem : string[]): void;
    exibirMensagemSucesso(): void;

}