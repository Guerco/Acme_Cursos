import { UsuarioListagem } from "../model/dto/UsuarioListagem";
import { ControladoraListagemUsuarios } from "../presenter/ControladoraListagemUsuarios";
import { VisaoListagemUsuario } from "./VisaoListagemUsuario";
import { UtilDOM } from "../util/UtilDOM";
import { ids, classes } from "../ui/listagem-usuario.ts";

export class VisaoListagemUsuarioDOM implements VisaoListagemUsuario{
    private controladora: ControladoraListagemUsuarios;
    
    constructor(){
        this.controladora = new ControladoraListagemUsuarios(this);
    }

    iniciar(): void {
      this.controladora.listarUsuarios();
    }

    exibirUsuarios(usuarios: UsuarioListagem []): void {            
        if (!usuarios || usuarios.length === 0) {
            this.exibirMensagem('Não há usuarios para listar.');
        } else {
            this.desenharUsuarios(usuarios);
           
        }
    }

    exibirMensagem(mensagem : string): void {
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
                    'aluno': '👨‍🎓 Alunos',
                    'professor': '👨‍🏫 Professores',
                    'administrador': '⚡ Administradores',
                    'professor-administrador': '🛠️👔 Professores-administradores'
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