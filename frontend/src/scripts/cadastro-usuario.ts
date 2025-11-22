import { rotasPaginas } from "../rotas";
import { VisaoCadastroUsuarioDOM } from "../view/VisaoCadastroUsuarioDOM";

const visao = new VisaoCadastroUsuarioDOM();

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}