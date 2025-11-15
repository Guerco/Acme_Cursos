import { UsuarioListagem } from '../model/dto/UsuarioListagem.ts';

export interface VisaoListagemUsuario {

    iniciar(): void;

    //saida
    exibirMensagem (mensagem : string) : void;
    exibirUsuarios(usuarios: Array<UsuarioListagem>): void;
}