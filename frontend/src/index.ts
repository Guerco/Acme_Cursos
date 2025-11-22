import { VisaoListagemCursosDom } from "./view/VisaoListagemCursosDOM.ts";
import { SessaoSessionStorage } from "./model/sessao/SessaoSessionStorage";

const visao = new VisaoListagemCursosDom(
    new SessaoSessionStorage()
);

visao.iniciar();