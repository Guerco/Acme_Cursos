import { UsuarioListagem } from "../dto/UsuarioListagem";
import { UsuarioCadastro } from "../dto/UsuarioCadastro"


export interface RepositorioCredenciais {
    listarTodos() : Promise<UsuarioListagem[]>;
    buscarPorNome(nome: string) : Promise<UsuarioListagem[]>;
    adicionar(usuario: UsuarioCadastro) : void;
}