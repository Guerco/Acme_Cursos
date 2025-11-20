import { UsuarioSessao } from "../dto/UsuarioSessao";
import { Sessao } from "./Sessao";

export class SessaoSessionStorage implements Sessao {
    iniciarSessao(usuario: UsuarioSessao): void {
        sessionStorage.setItem('nome-usuario', usuario.nome);
        sessionStorage.setItem('tipo-usuario', usuario.tipoUsuario);
    }
    
    encerrarSessao() {
        sessionStorage.clear();
    }
    
    estaLogado() {
        return sessionStorage.getItem('nome-usuario') !== null;
    }

    buscarNomeUsuario() : string {
        return sessionStorage.getItem('nome-usuario') ?? '';
    }

    buscarTipoUsuario() : string {
        return sessionStorage.getItem('tipo-usuario') ?? '';
    }

    verificarAutorizacao(autorizados : string[]) : boolean {
        const tipoUser = this.buscarTipoUsuario();

        return autorizados.includes(tipoUser);
    }
}