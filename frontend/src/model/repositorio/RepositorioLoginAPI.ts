import { rotasApi } from "../../rotas";
import {Credenciais} from "../dto/Credenciais";
import {UsuarioSessao} from "../dto/UsuarioSessao";
import { DominioException } from "../exception/DominioException";
import { RepositorioLogin } from "./RepositorioLogin";

export class RepositorioLoginAPI implements RepositorioLogin {
    async entrar(credenciais: Credenciais): Promise<UsuarioSessao>{
        try {
            const response = await fetch(rotasApi.login, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(credenciais)
                }
            );

            if (response.status >= 400 && response.status < 500) {
                throw new DominioException('Credenciais Inválidas.');

            }
            else if (!response.ok) {
                throw new Error();
            } else {
                const usuario = await response.json();
                return new UsuarioSessao(
                    usuario.nome, 
                    usuario.tipoUsuario, 
                );
            }
        } catch (err: any) {
            if (err instanceof DominioException)
                throw err;
            else
                throw new Error('Não foi possível entrar.');
        }
    }

    

    async sair(): Promise<void>{
        try {
            const response = await fetch(rotasApi.login, 
                { 
                    method: 'DELETE', 
                    credentials: 'include' 
                }
            );

            if (!response.ok) {
                throw new Error();
            } 
        } catch (err: any) {
            if (err instanceof DominioException)
                throw err;
            else
                throw new Error('Não foi possível sair da conta.');
        }
    }
}