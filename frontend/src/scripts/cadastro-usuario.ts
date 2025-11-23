import { SessaoSessionStorage } from "../model/sessao/SessaoSessionStorage";
import { rotasPaginas } from "../rotas";
import { VisaoCadastroUsuarioDOM } from "../view/VisaoCadastroUsuarioDOM";

const visao = new VisaoCadastroUsuarioDOM(
               new SessaoSessionStorage() 
            );

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}