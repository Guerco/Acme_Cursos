import { UsuarioListagem } from '../model/dto/UsuarioListagem.ts';
import { VisaoBase } from './VisaoBase.ts';

export interface VisaoListagemUsuario  extends VisaoBase{

    iniciar(): void;

    //entrada
    buscarTextoBusca() : string;


    //saida
    exibirMensagem (mensagem : string) : void;
    exibirUsuarios(usuarios: Array<UsuarioListagem>): void;
}