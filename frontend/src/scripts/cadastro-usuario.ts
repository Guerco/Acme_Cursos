import { rotasPaginas } from "../rotas";
import { VisaoCadastroUsuarioDOM } from "../view/VisaoCadastroUsuarioDOM";

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const mensagem = event.reason.message;
    
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
});

window.addEventListener('error', () => {  
    location.href = rotasPaginas.erro;
});

const visao = new VisaoCadastroUsuarioDOM();

visao.iniciar();