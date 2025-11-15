import { UsuarioCadastro } from "../model/dto/UsuarioCadastro";
import { ControladoraCadastroUsuario } from "../presenter/ControladoraCadastroUsuario";
import { ids, classes } from "../ui/cadastro-usuario-ui";
import { VisaoCadastroUsuario } from "./VisaoCadastroUsuario";
import { UtilDOM } from "../util/UtilDOM";
import { rotasPaginas } from "../rotas";


export class VisaoCadastroUsuarioDOM implements VisaoCadastroUsuario{
    private controladora: ControladoraCadastroUsuario;

    constructor(){
        this.controladora = new ControladoraCadastroUsuario(this);
    }
    
    iniciar(){
         const botaoExibir = document.getElementById(ids.exibirSenha);
         botaoExibir!.addEventListener('click', this.alternarVisibilidadeSenha);

         const botaoCadastrar = document.getElementById(ids.cadastro);
         botaoCadastrar!.addEventListener('click', (event) => {
            event.preventDefault(); 
            this.controladora.cadastrarUsuario()
         });

    }
    
    //entrada
    buscaDadosUsuario(): UsuarioCadastro {
      const nome = (document.getElementById(ids.nome) as HTMLInputElement).value;
      const email = (document.getElementById(ids.email) as HTMLInputElement).value;
      const senha = (document.getElementById(ids.senha) as HTMLInputElement).value;
      const tipoUsuario = (document.getElementById(ids.tipoUsuario) as HTMLInputElement).value;

      const usuario = new UsuarioCadastro(email, senha, nome, tipoUsuario);
      return usuario;
    }

    //saída
    alternarVisibilidadeSenha(): void{
        const inputSenha = document.getElementById(ids.senha) as HTMLInputElement;
        const botaoExibir = document.getElementById(ids.exibirSenha);
        const oculta = (botaoExibir!.innerText == '😑');
        botaoExibir!.innerText = oculta ? '😐':'😑';
        inputSenha!.type = oculta ? 'text' : 'password';
    }

    exibirMensagem(mensagem : string): void {
        const outMensagem = document.getElementById(ids.mensagem);
        outMensagem!.innerText = mensagem;
    }

    exibirMensagemSucesso(): void{
        const container = UtilDOM.criaComClasses('div', [classes.containerSucesso]);
        const mensagem = UtilDOM.criaComTextoEClasses('h3', 'Usuário cadastrado com sucesso!', [classes.mensagemSucesso]);
        const botaoVoltar = UtilDOM.criaComTextoEClasses('button', 'Voltar para Cursos 🏡', [classes.botaoVoltar]);
        botaoVoltar.onclick = () => {
            window.location.href = rotasPaginas.listagemCursos;
        };
        const botaoCadastrarNova = UtilDOM.criaComTextoEClasses('button', 'Cadastrar Nova 🆕', [classes.botaoCadastrarNova]);
                botaoCadastrarNova.onclick = () => {
                    window.location.href = rotasPaginas.cadastroUsuario;
                };
                const divCadastro = document.getElementById(ids.cadastro) as HTMLDivElement;
                container.append(mensagem, botaoVoltar, botaoCadastrarNova);
                divCadastro.innerHTML = '';
                divCadastro.append(container)
    }
}