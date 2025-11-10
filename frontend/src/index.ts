import { VisaoCabecalhoDOM } from "./view/VisaoCabecalhoDOM.ts";
import { VisaoListagemCursosDom } from "./view/VisaoListagemCursosDOM.ts";

const visaoCabecalho = new VisaoCabecalhoDOM();
const visao = new VisaoListagemCursosDom();

visaoCabecalho.iniciar();
visao.iniciar();