export const ids = {
    senha: 'senha',
    exibirSenha: 'botao-exibir-senha',
    cadastro: 'cadastro',
    tipoUsuario: 'tipo-usuario',
    nome: 'nome',
    email: 'email',
    mensagem: 'mensagem-cadastro',
    cadastrar: 'botao-cadastrar',
    form: 'form-cadastro'
};

export const classes = {
    botaoCadastrarNova: 'botao-cadastrar-nova',
    mensagemSucesso: 'mensagem-sucesso',
    botaoVoltar: 'botao-voltar',
    containerSucesso: 'container-sucesso',
    destaque: 'destaque',
}

export const idsCss = Object.fromEntries(
  Object.entries(ids).map(([c, id]) => [c, `#${id}`])
);