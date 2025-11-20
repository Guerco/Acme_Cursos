import { UsuarioSessao } from "../dto/UsuarioSessao";

export interface Sessao {
    iniciarSessao(usuario: UsuarioSessao): void;

    encerrarSessao() : void;

    estaLogado() :boolean;

    buscarNomeUsuario() : string;

    buscarTipoUsuario() : string;

    verificarAutorizacao(autorizados : string[]) : boolean;
}