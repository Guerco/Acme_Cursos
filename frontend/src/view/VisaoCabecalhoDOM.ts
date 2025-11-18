import { rotasPaginas } from "../rotas.ts";
import { UtilDOM } from "../util/UtilDOM.ts";
import { classes, ids } from "../ui/cabecalho-ui.ts";


const DIR_IMG = '/img';
const SRC_LOGO = DIR_IMG + '/logotipo.png';
const SRC_ICONE = DIR_IMG + '/menu.png';

type ItemMenu = {
    rota?: string;
    descricao?: string;
    linha?: boolean;
    subMenu?: ItemMenu[];
};

const ELEMENTOS_MENU: ItemMenu[] = [
    { linha:true },
    {
        rota: rotasPaginas.listagemCursos,
        descricao: 'Listagem de Cursos 🎓'
    },
    {
        rota: rotasPaginas.listagemPerguntas,
        descricao: 'Listagem de Perguntas ❔'
    },
    {
        rota: rotasPaginas.listagemUsuarios,
        descricao: 'Listagem de Usuários 👥'
    },
    { linha: true },
    {
        rota: rotasPaginas.cadastroPerguntas,
        descricao: 'Cadastro de Perguntas ❓'
    },
    {
        rota: rotasPaginas.cadastroUsuario,
        descricao: 'Cadastro de Usuários 👤'
    },
    { linha: true },
    {
        descricao: 'Relatórios 📊',
        subMenu: [
            {
                rota: rotasPaginas.rankingAlunos,
                descricao: 'Top Alunos 🏅'
            },
            {
                rota: rotasPaginas.listagemCursos,
                descricao: 'Alunos por Curso 📚'
            }
        ]
    },
    { linha:true }
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

        if (! this.header) {
            this.header = UtilDOM.cria('header');
            document.body.prepend(this.header);
        }
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

        const itens = UtilDOM.criaComClasses('div', ['itens-menu']);
        itens.append(...this.criaItensMenu());
        menu.append(logo, itens);

        this.menuLateral = menu;
        return menu;
    }

    private criaItensMenu(): HTMLElement[] {
        return ELEMENTOS_MENU.map(e => this.criaItemMenu(e)) as HTMLElement[];
    }

    private criaItemMenu(e : ItemMenu): HTMLElement|DocumentFragment|null {
        let item = null;
        
        if (e.rota && e.descricao) {
            item = UtilDOM.criaAncoraComTexto(e.descricao, e.rota) as HTMLAnchorElement;
        } 
        else if (e.descricao && e.subMenu) {
            const botao = UtilDOM.criaComTexto('a', e.descricao);
            const subMenu = UtilDOM.criaComClasses('ul', ['sub-menu']) as HTMLUListElement;
            const subitens = e.subMenu.map(se => this.criaItemMenu(se)) as HTMLElement[];

            botao.onclick = (e) =>  {
                e.preventDefault();
                this.alternarVisibilideSubMenu(subMenu);
            }

            subMenu.append(...subitens);

            item = UtilDOM.criaFragmentoComElementos([botao, subMenu]);
        }
        else if (e.linha) {
            item = UtilDOM.criaComClasses('div', ['linha-menu']) as HTMLDivElement;
        }

        return item;
    }

    private alternarVisibilideMenu() {
        this.menuLateral.classList.toggle(classes.visivel);
    }

    private alternarVisibilideSubMenu(subMenu : HTMLUListElement) {
        if (! subMenu.classList.contains(classes.visivel)) {
            subMenu.classList.add(classes.visivel);
            subMenu.classList.remove(classes.scroll);

            const adicionarScroll = () => {
                subMenu.classList.add(classes.scroll);
                subMenu.removeEventListener('transitionend', adicionarScroll);
            }
            subMenu!.addEventListener('transitionend', adicionarScroll);
        } else {
            subMenu!.classList.remove(classes.visivel, classes.scroll);
        }
    }

    private criarFundoEscuro() : HTMLDivElement {
        const fundo = UtilDOM.criaComClasses('div', [classes.fundoEscuro]) as HTMLDivElement;
        fundo.title = 'Fechar Menu';

        fundo.addEventListener('click', () => this.alternarVisibilideMenu());

        return fundo;
    }
}