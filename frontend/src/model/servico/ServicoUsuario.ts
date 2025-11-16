import { UsuarioCadastro } from "../dto/UsuarioCadastro";
import { UsuarioListagem } from "../dto/UsuarioListagem";
import { RepositorioCredenciais } from "../repositorio/RepositorioCredenciais";

export class ServicoUsuario{
    constructor(
        private repositorio : RepositorioCredenciais
    ){}

    async listarTodos() : Promise<UsuarioListagem[]> {
        try{
            return await this.repositorio.listarTodos();
        } catch(err : any) {
            throw new Error(err.message);
        }
    }

    async cadastrarUsuario(usuario: UsuarioCadastro) : Promise<void> {
        await this.repositorio.adicionar(usuario);
    }
}