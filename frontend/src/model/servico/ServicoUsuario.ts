import { UsuarioCadastro } from "../dto/UsuarioCadastro";
import { UsuarioListagem } from "../dto/UsuarioListagem";
import { RepositorioCredenciais } from "../repositorio/RepositorioCredenciais";

export class ServicoUsuario{
    private usuarios: UsuarioListagem[]|null = null;

    constructor(
        private repositorio : RepositorioCredenciais
    ){}

    async listarTodos() : Promise<UsuarioListagem[]> {
        this.usuarios = await this.repositorio.listarTodos()
        return this.usuarios; 
    }

    async buscarPorNome(nome: string) : Promise<UsuarioListagem[]> {
        this.usuarios = await this.repositorio.buscarPorNome(nome)
        return this.usuarios; 
    }

    async cadastrarUsuario(usuario: UsuarioCadastro) : Promise<void> {
        await this.repositorio.adicionar(usuario);
    }

    async filtrarListaCargo(cargo: string) : Promise<UsuarioListagem[]> {
        return this.usuarios!.filter(u =>
            cargo == '' ||
            u.tipoUsuario.toLowerCase() == cargo
        );
    }
}