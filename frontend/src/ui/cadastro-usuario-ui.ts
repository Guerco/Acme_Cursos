export const ids = {
    senha: 'senha',
    exibirSenha: 'exibir-senha',
    cadastro: 'cadastrar',
    tipoUsuario: 'tipo-usuario',
    nome: 'nome',
    email: 'email',
    mensagem: 'mensagem-cadastro',
    cadastrar: 'cadastrar'
};

export const classes = {
    botaoCadastrarNova: 'botao-cadastrar-nova',
    mensagemSucesso: 'mensagem-sucesso',
    botaoVoltar: 'botao-voltar',
    containerSucesso: 'container-sucesso'
}

export const idsCss = Object.fromEntries(
  Object.entries(ids).map(([c, id]) => [c, `#${id}`])
);