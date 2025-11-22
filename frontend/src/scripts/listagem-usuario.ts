import { rotasPaginas } from "../rotas";
import { VisaoListagemUsuarioDOM } from "../view/VisaoListagemUsuarioDOM";

const visao = new VisaoListagemUsuarioDOM();

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}