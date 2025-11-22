import { VisaoRankingAlunosDOM } from "../view/VisaoRankingAlunosDOM";
import { rotasPaginas } from "../rotas";

const visao = new VisaoRankingAlunosDOM();

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}