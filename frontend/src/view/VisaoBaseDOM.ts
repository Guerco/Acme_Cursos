import { rotasPaginas } from "../rotas";
import { VisaoBase } from "./VisaoBase";

export class VisaoBaseDOM implements VisaoBase {

    redirecionaParaErro(mensagem: string): void{
        location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
    }
}