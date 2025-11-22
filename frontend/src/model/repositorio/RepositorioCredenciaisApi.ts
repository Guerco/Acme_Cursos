import { rotasApi } from "../../rotas";
import { RepositorioCredenciais } from "./RepositorioCredenciais";
import { UsuarioListagem } from "../dto/UsuarioListagem";
import { UsuarioCadastro } from "../dto/UsuarioCadastro";
import { DominioException } from "../exception/DominioException";
import { NaoAutorizadoException } from "../exception/NaoAutorizadoException";

export class RepositorioCredenciaisApi implements RepositorioCredenciais {
    
    async listarTodos() : Promise<UsuarioListagem[]>{
        try {
            const response = await fetch(rotasApi.usuarios, {
                    credentials: 'include' 
            });

            if (!response.ok){
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            const resposta = await response.json();

            const usuarios = resposta.map((usuario: any) => 
                new UsuarioListagem(
                    usuario.tipoUsuario,
                    usuario.nome,
                    usuario.email
                )
            );
            return usuarios;
        } catch(err) {
            if (err instanceof NaoAutorizadoException) throw err;
            throw new Error('Não foi possível buscar os usuários.');
        }
    }

    async buscarPorNome(nome: string) : Promise<UsuarioListagem[]>{
        try {
            const response = await fetch(rotasApi.usuariosBusca(nome), {
                    credentials: 'include' 
            });

            if (!response.ok){
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            const resposta = await response.json();

            const usuarios = resposta.map((usuario: any) => 
                new UsuarioListagem(
                    usuario.tipoUsuario,
                    usuario.nome,
                    usuario.email
                )
            );
            return usuarios;
        } catch(err) {
            if (err instanceof NaoAutorizadoException) throw err;
            throw new Error('Não foi possível buscar os usuários.');
        }
    }

    async adicionar(usuario: UsuarioCadastro): Promise<void> {
        try {

            const response = await fetch(rotasApi.usuarios,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(usuario)
            });
             
            if (!response.ok){
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                if (response.status >= 400 && response.status < 500) {
                    let problemas = await response.json();
                    throw DominioException.comProblemas(problemas.erros);
                } else throw new Error();   
            }

        } catch(error) {
            if (error instanceof DominioException
                || error instanceof NaoAutorizadoException
            ) {
                throw error;
            }
            throw new Error('Erro ao salvar o usuário');
        }
    }
}
