import { VisaoListagemPerguntasDOM } from "../view/VisaoListagemPerguntasDOM.ts";
import { rotasPaginas } from "../rotas";
import { VisaoCabecalhoDOM } from "../view/VisaoCabecalhoDOM.ts";

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const mensagem = event.reason.message;
    
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
});

window.addEventListener('error', () => {  
    location.href = rotasPaginas.erro;
});

const visaoCabecalho = new VisaoCabecalhoDOM();
const visao = new VisaoListagemPerguntasDOM();

visaoCabecalho.iniciar();
visao.iniciar();