import { VisaoCadastroPerguntasDOM } from "../view/VisaoCadastroPerguntasDOM";
import { VisaoCabecalhoDOM } from "../view/VisaoCabecalhoDOM.ts";
import { rotasPaginas } from "../rotas";

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const mensagem = event.reason.message;
    
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
});

window.addEventListener('error', () => {  
    location.href = rotasPaginas.erro;
});

const visaoCabecalho = new VisaoCabecalhoDOM();
const visao = new VisaoCadastroPerguntasDOM();

visaoCabecalho.iniciar();
await visao.iniciar();