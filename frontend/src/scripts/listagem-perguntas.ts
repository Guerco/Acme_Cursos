import { VisaoListagemPerguntasDOM } from "../view/VisaoListagemPerguntasDOM.ts";
import { rotasPaginas } from "../rotas";
import { SessaoSessionStorage } from "../model/sessao/SessaoSessionStorage";

const visao = new VisaoListagemPerguntasDOM(
    new SessaoSessionStorage()
);

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}