import {Credenciais} from "../dto/Credenciais";
import {UsuarioSessao} from "../dto/UsuarioSessao";
import { RepositorioLogin } from "./RepositorioLogin";

export class RepositorioLoginJSON implements RepositorioLogin {
    async entrar(credenciais: Credenciais): Promise<UsuarioSessao>{
        return new UsuarioSessao(
            'Seu Juvenal',
            'professor'
        );
    }
    async sair(): Promise<void>{}
}