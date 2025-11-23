import { rotasPaginas } from "../rotas";
import { VisaoListagemUsuarioDOM } from "../view/VisaoListagemUsuarioDOM";
import { SessaoSessionStorage } from "../model/sessao/SessaoSessionStorage";

const visao = new VisaoListagemUsuarioDOM(
    new SessaoSessionStorage()
);

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}