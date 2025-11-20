import { rotasPaginas } from "../rotas.ts";
import { UtilDOM } from "../util/UtilDOM.ts";
import { classes, ids } from "../ui/cabecalho-ui.ts";
import { ControladoraCabecalho } from "../presenter/ControladoraCabecalho.ts";
import { VisaoCabecalho } from "./VisaoCabecalho.ts";
import { Credenciais } from "../model/dto/Credenciais.ts";
import { Sessao } from "../model/sessao/Sessao.ts";
import { TipoUsuario } from "../model/TipoUsuario.ts";


const DIR_IMG = '/img/';
const SRC_LOGO = DIR_IMG + 'logotipo.png';
const SRC_ICONE = DIR_IMG + 'menu.png';

type ItemMenu = {
    rota?: string;
    descricao?: string;
    linha?: boolean;
    subMenu?: ItemMenu[];
    autorizados?: string[];
    logado?: boolean;
};

const ELEMENTOS_MENU: ItemMenu[] = [
    { linha:true },
    {
        rota: rotasPaginas.listagemCursos,
        descricao: 'Listagem de Cursos 🎓'
    },
    {
        rota: rotasPaginas.listagemPerguntas,
        descricao: 'Listagem de Perguntas ❔',
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]
    },
    {
        rota: rotasPaginas.listagemUsuarios,
        descricao: 'Listagem de Usuários 👥',
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]
    },
    { linha: true,
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ] },
    {
        rota: rotasPaginas.cadastroPerguntas,
        descricao: 'Cadastro de Perguntas ❓',
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]
    },
    {
        rota: rotasPaginas.cadastroUsuario,
        descricao: 'Cadastro de Usuários 👤',
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]
    },
    { linha: true, logado: true, autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]},
    {
        logado: true,
        descricao: 'Relatórios 📊',
        subMenu: [
            {
                rota: rotasPaginas.rankingAlunos,
                descricao: 'Top Alunos 🏅'
            },
            {
                rota: rotasPaginas.listagemCursos,
                descricao: 'Total Alunos Curso 📚',
                autorizados: [
                    TipoUsuario.ADMINISTRADOR,
                    TipoUsuario.PROFESSOR,
                    TipoUsuario.PROFESSOR_ADMINISTRADOR,
                ] 
            }
        ]
    },
    { linha:true }
];


export class VisaoCabecalhoDOM implements VisaoCabecalho {
    private header! : HTMLElement;
    private menuLateral! : HTMLDivElement;
    private caixaLogin! : HTMLDialogElement;
    private controladora!: ControladoraCabecalho; 
    private email!: HTMLInputElement; 
    private senha!: HTMLInputElement; 
    private mensagemLogin!: HTMLOutputElement; 
    
    constructor(
        private sessao : Sessao
    ) {
        this.controladora = new ControladoraCabecalho(
            this,
            this.sessao
        );
    }
    

    iniciar() {
        this.carregarElementos();

        this.montarCabecalho();

        this.caixaLogin.addEventListener('submit', async (event) => {
            event.preventDefault();

            await this.controladora.entrar();
        });
    }

    // Métodos de Entrada
    buscarCredenciais(): Credenciais {
        return new Credenciais(
            this.email.value,
            this.senha.value,
        );
    }

    // Métodos de Saída
    exibirMensagemLogin(mensagem : string): void {
        this.mensagemLogin.innerText = mensagem;
    }

    private montarCabecalho() {
        const divCabecalho = UtilDOM.criaComClasses('div', [classes.cabecalho]);

        const logo = UtilDOM.criaImgComClasses(SRC_LOGO, 'Logotipo do Site', [classes.logo]);
        logo.addEventListener('click', this.irParaPaginaInicial);
        const icone = UtilDOM.criaImgComClasses(SRC_ICONE, 'Icone Menu', [classes.icon]);
        icone.title = 'Abrir Menu';

        divCabecalho.append(logo, icone);

        this.caixaLogin = this.criarCaixaLogin();

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

        this.header.prepend(divCabecalho, menuLateral, fundoEscuro, this.caixaLogin);
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

        const itens = UtilDOM.criaComClasses('div', [classes.itensMenu]);

        itens.append(...this.criaItensMenu());

        menu.appendChild(logo);
        let botao = null;

        if ( this.sessao.estaLogado() ) {
            menu.appendChild(this.criaItemMenu(
                {linha:true}
            ) as HTMLDivElement);

            const nome = this.sessao.buscarNomeUsuario() ;
            const tipo = this.sessao.buscarTipoUsuario();

            const infoUsuario = UtilDOM.criaComClasses('div', [classes.infoUsuario]);

            const nomeUsuario = UtilDOM.criaComTextoEClasses('p', nome!, [classes.nomeUsuario]);
            const tipoUsuario = UtilDOM.criaComTextoEClasses('p', tipo!, [classes.tipoUsuario]);

            infoUsuario.append(nomeUsuario, tipoUsuario);

            menu.appendChild(infoUsuario);
            
            botao = this.criaItemMenu({
                rota: '#',
                descricao: 'Sair 🚪'
            }) as HTMLAnchorElement;
    
            botao.addEventListener('click', (e) => {
                e.preventDefault();
                this.controladora.sair();
            });
            botao.classList.add(classes.botaoSair);
        } else {
            botao = this.criaItemMenu({
                rota: '#',
                descricao: 'Entrar 🚪'
            }) as HTMLAnchorElement;
            botao.classList.add(classes.botaoEntrar);
    
            botao.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.caixaLogin.showModal();
            });
        }

        menu.append(itens, botao);

        this.menuLateral = menu;
        return menu;
    }

    private criaItensMenu(): HTMLElement[] {
        return ELEMENTOS_MENU.map(e => this.criaItemMenu(e)).filter(e => e!==null) as HTMLElement[];
    }

    private criaItemMenu(e : ItemMenu): HTMLElement|DocumentFragment|null {
        let item = null;
        if (e.logado) {
            if (! this.sessao.estaLogado())
                return item;
        }

        if (e.autorizados) {
            if (! this.sessao.verificarAutorizacao(e.autorizados))
                return item;
        }

        if (e.rota && e.descricao) {
            item = UtilDOM.criaAncoraComTexto(e.descricao, e.rota) as HTMLAnchorElement;
        } 
        else if (e.descricao && e.subMenu) {
            const botao = UtilDOM.criaComTexto('a', e.descricao);
            const subMenu = UtilDOM.criaComClasses('ul', [classes.submenu]) as HTMLUListElement;
            const subitens = e.subMenu.map(se => this.criaItemMenu(se)) as HTMLElement[];

            botao.onclick = (e) =>  {
                e.preventDefault();
                this.alternarVisibilideSubMenu(subMenu);
            }

            subMenu.append(...subitens.filter(e => e!==null));

            item = UtilDOM.criaFragmentoComElementos([botao, subMenu]);
        }
        else if (e.linha) {
            item = UtilDOM.criaComClasses('div', [classes.linha]) as HTMLDivElement;
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

    private criarCaixaLogin(): HTMLDialogElement {
        const dialog = UtilDOM.criaComId('dialog', ids.caixaCredenciais) as HTMLDialogElement;

        const logoDiv = UtilDOM.criaComClasses('div', [classes.logoCredenciais]);
        const logoImg = UtilDOM.criaImg(SRC_LOGO, 'Logotipo Quiz');
        logoDiv.appendChild(logoImg);

        const form = UtilDOM.criaComId('form', ids.formCredenciais) as HTMLFormElement;
        form.method = 'dialog';

        const h1 = UtilDOM.criaComTexto('h1', 'Informe suas Credenciais');

        const inputsDiv = UtilDOM.criaComClasses('div', [classes.inputCredenciais]);

        const labelEmail = UtilDOM.criaComTexto('label', 'Email:');
        labelEmail.setAttribute('for', ids.email);

        const containerEmail = UtilDOM.criaComClasses('div', ['container-input']);
        const inputEmail = UtilDOM.criaComId('input', ids.email) as HTMLInputElement;
        inputEmail.type = 'email';
        inputEmail.name = 'email';
        inputEmail.required = true;
        inputEmail.placeholder = 'Digite seu Email';
        containerEmail.append(labelEmail, inputEmail);

        this.email = inputEmail;

        inputsDiv.append(containerEmail);

        const labelSenha = UtilDOM.criaComTexto('label', 'Senha:') as HTMLLabelElement;
        labelSenha.setAttribute('for', ids.senha);

        const containerInputSenha = UtilDOM.criaComClasses('div', ['container-input']);
        const containerSenha = UtilDOM.criaComClasses('div', ['container-senha']);

        const inputSenha = UtilDOM.criaComClassesEId('input', ['input-senha'], ids.senha) as HTMLInputElement;
        inputSenha.type = 'password';
        inputSenha.required = true;
        inputSenha.placeholder = 'Digite sua senha';

        this.senha = inputSenha;

        const botaoExibirSenha = UtilDOM.criaComTextoEClasses('button', '🙈', [classes.botaoSenha]) as HTMLButtonElement;
        botaoExibirSenha.type = 'button';
        botaoExibirSenha.title = 'Exibir Senha';

        containerSenha.append(inputSenha, botaoExibirSenha);
        containerInputSenha.append(labelSenha, containerSenha);
        inputsDiv.appendChild(containerInputSenha);

        const acoesDiv = UtilDOM.criaComClasses('div', [classes.acoesCredenciais]);
        const output = UtilDOM.criaComId('output', ids.mensagemLogin) as HTMLOutputElement;
        const botaoEnviar = UtilDOM.criaComId('button', ids.botaoEnviar);
        botaoEnviar.textContent = 'Entrar';

        const botaoCancelar = UtilDOM.criaComId('button', ids.botaoCancelar) as HTMLButtonElement;
        botaoCancelar.type = 'button';
        botaoCancelar.textContent = 'Cancelar';
        botaoCancelar.onclick = () => dialog.close();

        acoesDiv.append(output, botaoEnviar, botaoCancelar);

        form.append(h1, inputsDiv, acoesDiv);
        dialog.append(logoDiv, form);

        this.mensagemLogin = output;
        return dialog;
    }

}