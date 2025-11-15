import { rotasPaginas } from "../rotas.ts";
import { UtilDOM } from "../util/UtilDOM.ts";
import { classes, ids } from "../ui/cabecalho-ui.ts";


const DIR_IMG = '/img';
const SRC_LOGO = DIR_IMG + '/logotipo.png';
const SRC_ICONE = DIR_IMG + '/menu.png';

type ItemMenu = {
    rota: string;
    descricao: string;
};

const ELEMENTOS_MENU: ItemMenu[] = [
    {
        rota: rotasPaginas.listagemCursos,
        descricao: '🎓 Cursos'
    },
    {
        rota: rotasPaginas.listagemPerguntas,
        descricao: '❔ Listagem de Perguntas'
    },
    {
        rota: rotasPaginas.cadastroPerguntas,
        descricao: '❓ Cadastro de Perguntas'
    }
];


export class VisaoCabecalhoDOM {
    private header! : HTMLElement;
    private menuLateral! : HTMLDivElement;
    
    iniciar() {
        this.carregarElementos();

        this.montarCabecalho();
    }

    // Métodos de Entrada

    // Métodos de Saída
    private montarCabecalho() {
        const divCabecalho = UtilDOM.criaComClasses('div', [classes.cabecalho]);

        const logo = UtilDOM.criaImgComClasses(SRC_LOGO, 'Logotipo do Site', [classes.logo]);
        logo.addEventListener('click', this.irParaPaginaInicial);
        const icone = UtilDOM.criaImgComClasses(SRC_ICONE, 'Icone Menu', [classes.icon]);
        icone.title = 'Abrir Menu';

        divCabecalho.append(logo, icone);

        const menuLateral = this.criaMenuLateral();

        const fundoEscuro = this.criarFundoEscuro();

        icone.addEventListener('click', () => this.alternarVisibilideMenu());

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuLateral.classList.contains(classes.visivel)) {
                this.alternarVisibilideMenu();
            }
        });

        this.header.prepend(divCabecalho, menuLateral, fundoEscuro);
    }

    // Auxiliares
    private carregarElementos() {
        this.header = document.querySelector('header') as HTMLElement;
    }

    private irParaPaginaInicial() {
        location.href = rotasPaginas.listagemCursos;
    }

    private criaMenuLateral(): HTMLDivElement {
        const menu = UtilDOM.criaComClasses('div', [classes.menuLateral]) as HTMLDivElement;

        const logo = UtilDOM.criaImgComClassesEId(SRC_LOGO, 'Logotipo do Site', [classes.logo], ids.logoMenu);
        logo.title = 'Fechar Menu';
        logo.addEventListener('click', () => this.alternarVisibilideMenu());

        const itens = this.criaItensMenu();
        menu.append(logo, ...itens);

        this.menuLateral = menu;
        return menu;
    }

    private criaItensMenu(): HTMLAnchorElement[] {
        return ELEMENTOS_MENU.map(e => UtilDOM.criaAncoraComTexto(e.descricao, e.rota));
    }

    private alternarVisibilideMenu() {
        this.menuLateral.classList.toggle(classes.visivel);
    }

    private criarFundoEscuro() : HTMLDivElement {
        const fundo = UtilDOM.criaComClasses('div', [classes.fundoEscuro]) as HTMLDivElement;
        fundo.title = 'Fechar Menu';

        fundo.addEventListener('click', () => this.alternarVisibilideMenu());

        return fundo;
    }
}