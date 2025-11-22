import { VisaoListagemPerguntasDOM } from "../view/VisaoListagemPerguntasDOM.ts";
import { rotasPaginas } from "../rotas";

const visao = new VisaoListagemPerguntasDOM();

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}