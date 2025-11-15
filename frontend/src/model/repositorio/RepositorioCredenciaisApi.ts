import { rotasApi } from "../../rotas";
import { RepositorioCredenciais } from "./RepositorioCredenciais";
import { UsuarioListagem } from "../dto/UsuarioListagem";
import { UsuarioCadastro } from "../dto/UsuarioCadastro";
import { DominioException } from "../exception/DominioException";

export class RepositorioCredenciaisApi implements RepositorioCredenciais {
    
    async listarTodos() : Promise<UsuarioListagem[]>{
        try {
            const response = await fetch(rotasApi.usuarios);

            if (!response.ok){
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
                    body: JSON.stringify(usuario)
            });
             
            if (!response.ok){
                if (response.status >= 400 && response.status < 500) {
                    let problemas = await response.json();
                    throw DominioException.comProblemas(problemas.erros);
                } else throw new Error();   
            }

        } catch(error) {
            if (error instanceof DominioException) {
                throw error;
            }
            throw new Error('Erro ao salvar o usuário');
        }
    }
}
