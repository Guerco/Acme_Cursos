import { VisaoQuizDOM } from "../view/VisaoQuizDOM";
import { rotasPaginas } from "../rotas";

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const mensagem = event.reason.message;
    
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
});

window.addEventListener('error', () => {  
    location.href = rotasPaginas.erro;
});

const visao = new VisaoQuizDOM();

visao.iniciar();