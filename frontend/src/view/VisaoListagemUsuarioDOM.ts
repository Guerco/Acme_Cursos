import { UsuarioListagem } from "../model/dto/UsuarioListagem";
import { ControladoraListagemUsuarios } from "../presenter/ControladoraListagemUsuarios";
import { VisaoListagemUsuario } from "./VisaoListagemUsuario";
import { UtilDOM } from "../util/UtilDOM";
import { ids, classes } from "../ui/listagem-usuario-ui.ts";
import { Sessao } from "../model/sessao/Sessao.ts";
import { VisaoBaseDOM } from "./VisaoBaseDOM.ts";
import { TipoUsuario } from "../model/TipoUsuario.ts";

export class VisaoListagemUsuarioDOM extends VisaoBaseDOM implements VisaoListagemUsuario{
    private controladora: ControladoraListagemUsuarios;
    
    constructor(private sessao: Sessao){
        super();
        this.controladora = new ControladoraListagemUsuarios(this);
    }

    iniciar(): void {
        if(!this.sessao.estaLogado() ||
            !this.sessao.verificarAutorizacao([
                TipoUsuario.ADMINISTRADOR,
                TipoUsuario.PROFESSOR,
                TipoUsuario.PROFESSOR_ADMINISTRADOR
            ])
        ){
            super.redirecionaParaErro('Página não encontrada ❌');
            return; 
        }

        this.controladora.listarUsuarios();

        const selectCargo = document.getElementById(ids.tipoUsuario) as HTMLSelectElement;
        selectCargo.addEventListener('change', (e) => {
            this.controladora.filtrarCargo(e);
        });

        const busca = document.getElementById(ids.formBusca) as HTMLFormElement;
        busca.addEventListener('submit', (e) => {
            e.preventDefault();
            selectCargo.selectedIndex = 0;
            this.controladora.buscar();
        });
    }

    // Métodos de Entrada
    public buscarTextoBusca () : string {
        const inputBusca = document.getElementById(ids.inputBusca) as HTMLInputElement;
        return inputBusca.value;
    }
    
    // Métodos de Saída
    exibirUsuarios(usuarios: UsuarioListagem []): void {            
        if (!usuarios || usuarios.length === 0) {
            this.exibirMensagem('Não há usuarios para listar.');
        } else {
            this.desenharUsuarios(usuarios);
           
        }
    }

    exibirMensagem(mensagem : string): void {
        const tbody = document.querySelector('tbody') as HTMLElement;
        tbody.innerHTML = "";
        const outMensagem = document.getElementById(ids.mensagem);
        outMensagem!.innerText = mensagem;
    }

    //Métodos Auxiliares

    private desenharUsuarios( usuarios: UsuarioListagem [] ) {
        let elementos = [];
        let cargo = '';

        
        for (const u of usuarios) {
            if(cargo != u.tipoUsuario) {
                const trTitulo = UtilDOM.criaComClasses('tr', [classes.tituloCargo]);

                const titulos: Record<string, string> = {
                    'Aluno': '👨‍🎓 Alunos',
                    'Professor': '👨‍🏫 Professores',
                    'Administrador': '⚡ Administradores',
                    'Professor-Administrador': '🛠️👔 Professores-administradores'
                };

                const titulo = titulos[u.tipoUsuario] ?? 'Cargo Desconhecido';
                const tdTitulo = UtilDOM.criaComTexto('td', titulo) as HTMLTableCellElement;
                trTitulo.appendChild(tdTitulo);

                elementos.push(trTitulo);
            }

            cargo = u.tipoUsuario;

            elementos.push(this.criarTabela(u));
        }
        const frag = UtilDOM.criaFragmentoComElementos(elementos);
        const outMensagem = document.getElementById(ids.mensagem);
        outMensagem!.innerText = '';
        const tbody = document.querySelector('tbody') as HTMLElement;
        tbody.innerHTML = "";
        tbody.append(frag);
    }

    private criarTabela( u: UsuarioListagem ): HTMLElement {
        const tr = UtilDOM.cria('tr');
        tr.title = u.tipoUsuario;

        const nome = u.nome.toString() || 'Sem nome';
        const email = u.email.toString() || 'Sem email';

        const td = UtilDOM.cria('td');
        const ul = UtilDOM.criaComClasses( 'ul', [classes.infoUsuario] );

        const liNome = UtilDOM.criaComTexto('li', nome);
        const liEmail = UtilDOM.criaComTextoEClasses('li', email, [classes.emailUsuario]);

        ul.append(liNome, liEmail);
        td.appendChild(ul);
        tr.appendChild( td );
        return tr;
    }
}