import { VisaoQuizDOM } from "../view/VisaoQuizDOM";
import { rotasPaginas } from "../rotas";

const visao = new VisaoQuizDOM();

try {
    await visao.iniciar();
} catch (err : any) {
    const mensagem = err.message;
    location.href = rotasPaginas.erro + (mensagem ? `?msg=${encodeURIComponent(mensagem)}` : '');
}