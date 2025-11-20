import { VisaoCabecalhoDOM } from "../../view/VisaoCabecalhoDOM";
import { SessaoSessionStorage } from "../../model/sessao/SessaoSessionStorage";

const visao = new VisaoCabecalhoDOM(
    new SessaoSessionStorage()
);

visao.iniciar();
