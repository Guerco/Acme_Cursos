import { Credenciais } from "../model/dto/Credenciais";
import { ItemMenu } from "../scripts/elementos/itens-menu";

export interface VisaoCabecalho {

    iniciar() : void;

    // Métodos de Entrada
    buscarCredenciais(): Credenciais;
    montarCabecalho(itensMenu : ItemMenu[]): void;

    // Métodos de Saída
    exibirMensagemLogin(mensagem : string): void;
    redirecionarQuiz(idAssunto : number) : void;
}