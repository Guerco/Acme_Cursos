import { Credenciais } from "../model/dto/Credenciais";

export interface VisaoCabecalho {

    iniciar() : void;

    // Métodos de Entrada
    buscarCredenciais(): Credenciais;
    
    // Métodos de Saída
    exibirMensagemLogin(mensagem : string): void;

}