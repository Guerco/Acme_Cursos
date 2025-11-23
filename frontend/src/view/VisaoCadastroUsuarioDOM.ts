import { UsuarioCadastro } from "../model/dto/UsuarioCadastro";
import { ControladoraCadastroUsuario } from "../presenter/ControladoraCadastroUsuario";
import { ids, classes } from "../ui/cadastro-usuario-ui";
import { VisaoCadastroUsuario } from "./VisaoCadastroUsuario";
import { UtilDOM } from "../util/UtilDOM";
import { rotasPaginas } from "../rotas";
import { Sessao } from "../model/sessao/Sessao";
import { TipoUsuario } from "../model/TipoUsuario";
import { VisaoBaseDOM } from "./VisaoBaseDOM";

export class VisaoCadastroUsuarioDOM extends VisaoBaseDOM implements VisaoCadastroUsuario {
    private controladora: ControladoraCadastroUsuario;

    constructor(private sessao: Sessao){
        super();
        this.controladora = new ControladoraCadastroUsuario(this);
    }
    
    iniciar(){

        if(!this.sessao.estaLogado() ||
            !this.sessao.verificarAutorizacao([
                TipoUsuario.ADMINISTRADOR,
                TipoUsuario.PROFESSOR_ADMINISTRADOR
            ])
        ){
            super.redirecionaParaErro('Página não encontrada ❌');
            return; 
        }

         const form = document.getElementById(ids.form);
         form!.addEventListener('submit', (event) => {
            event.preventDefault(); 
            this.controladora.cadastrarUsuario()
         });
    }
    
    //entrada
    buscaDadosUsuario(): UsuarioCadastro {
      const nome = (document.getElementById(ids.nome) as HTMLInputElement).value;
      const email = (document.getElementById(ids.email) as HTMLInputElement).value;
      const senha = (document.getElementById(ids.senha) as HTMLInputElement).value;
      const tipo = (document.getElementById(ids.tipoUsuario) as HTMLInputElement).value;

      const usuario = new UsuarioCadastro(email, senha, nome, tipo);
      return usuario;
    }

    exibirMensagem(mensagens: string[]): void {
        const mensagemErro = document.getElementById(ids.mensagem);
        
        mensagemErro!.innerHTML = '';
        mensagemErro!.classList.add(classes.destaque);
        setTimeout(() => {
            mensagemErro!.classList.remove(classes.destaque);
        }, 500);

        for (const m of mensagens) {
            const liMensagem = UtilDOM.criaComTexto('li', m);

            mensagemErro!.appendChild(liMensagem);
        }
    }


    exibirMensagemSucesso(): void{
        const container = UtilDOM.criaComClasses('div', [classes.containerSucesso]);
        const mensagem = UtilDOM.criaComTextoEClasses('h3', 'Usuário cadastrado com sucesso!', [classes.mensagemSucesso]);
        const botaoVoltar = UtilDOM.criaComTextoEClasses('button', 'Ir para Cursos 🏡', [classes.botaoVoltar]);
        botaoVoltar.onclick = () => {
            window.location.href = rotasPaginas.listagemCursos;
        };
        const botaoCadastrarNova = UtilDOM.criaComTextoEClasses('button', 'Cadastrar Novo 🆕', [classes.botaoCadastrarNova]);
        botaoCadastrarNova.onclick = () => {
            window.location.href = rotasPaginas.cadastroUsuario;
        };
        const divCadastro = document.getElementById(ids.cadastro) as HTMLDivElement;
        container.append(mensagem, botaoVoltar, botaoCadastrarNova);
        divCadastro.innerHTML = '';
        divCadastro.append(container)
    }
}