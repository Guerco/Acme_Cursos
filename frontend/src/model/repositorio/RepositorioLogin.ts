import {Credenciais} from "../dto/Credenciais";
import {UsuarioSessao} from "../dto/UsuarioSessao";

export interface RepositorioLogin {
    entrar(credenciais: Credenciais): Promise<UsuarioSessao>;
    sair(): Promise<void>;
}