import { UsuarioCadastro } from "../model/dto/UsuarioCadastro";
import { VisaoBase } from "./VisaoBase";

export interface VisaoCadastroUsuario extends VisaoBase{

    iniciar(): void;

    //entrada
    buscaDadosUsuario(): UsuarioCadastro;

    //saida
    exibirMensagem(mensagem : string[]): void;
    exibirMensagemSucesso(): void;

}