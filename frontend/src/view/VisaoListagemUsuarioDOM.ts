import { UsuarioListagem } from "../model/dto/UsuarioListagem";
import { ControladoraListagemUsuarios } from "../presenter/ControladoraListagemUsuarios";
import { VisaoListagemUsuario } from "./VisaoListagemUsuario";
import { UtilDOM } from "../util/UtilDOM";
import { ids } from "../ui/listagem-usuario.ts";

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
    
        const elementos = usuarios.map(u => this.criarTabela(u));
        const frag = UtilDOM.criaFragmentoComElementos(elementos);
        const tbody = document.querySelector('tbody') as HTMLElement;
        tbody.innerHTML = "";
        tbody.append(frag);
    }

    private criarTabela( u: UsuarioListagem ): HTMLElement {
        const tr = UtilDOM.cria('tr');

        const tdTipoUsuario = UtilDOM.cria( 'td' );
        tdTipoUsuario.textContent = u.tipoUsuario?.toString() || '';

        const tdNome = UtilDOM.cria( 'td' );
        tdNome.textContent = u.nome.toString() || '';

        const tdEmail = UtilDOM.cria( 'td' );
        tdEmail.textContent = u.email.toString() || '';

        tr.append( tdTipoUsuario, tdNome, tdEmail);
        return tr;
    }
}