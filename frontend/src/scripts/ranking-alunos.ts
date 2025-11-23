import { VisaoRankingAlunosDOM } from "../view/VisaoRankingAlunosDOM";
import { rotasPaginas } from "../rotas";
import { SessaoSessionStorage } from "../model/sessao/SessaoSessionStorage";

const visao = new VisaoRankingAlunosDOM(
    new SessaoSessionStorage()
);

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}