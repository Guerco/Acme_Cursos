import { VisaoCadastroPerguntasDOM } from "../view/VisaoCadastroPerguntasDOM";
import { rotasPaginas } from "../rotas";
import { SessaoSessionStorage } from "../model/sessao/SessaoSessionStorage";

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const mensagem = event.reason.message;
    
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
});

window.addEventListener('error', () => {  
    location.href = rotasPaginas.erro;
});

const visao = new VisaoCadastroPerguntasDOM(
    new SessaoSessionStorage()
);

visao.iniciar();