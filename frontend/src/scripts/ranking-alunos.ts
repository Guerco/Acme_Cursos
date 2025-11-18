import { VisaoRankingAlunosDOM } from "../view/VisaoRankingAlunosDOM";
import { rotasPaginas } from "../rotas";

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const mensagem = event.reason.message;
    
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
});

window.addEventListener('error', () => {  
    location.href = rotasPaginas.erro;
});

const visao = new VisaoRankingAlunosDOM();

visao.iniciar();