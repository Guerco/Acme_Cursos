export const ids = {
    selectProfessor: 'professor',
    selectCurso: 'curso',
    selectAssunto: 'assunto',
    selectDificuldade: 'dificuldade',
    botaoAdicionarResposta: 'adicionar-resposta',
    botaoRemoverResposta: 'remover-resposta',
    campoDescricao: 'descricao',
    inputFigura: 'figura',
    formCadastro: 'form-cadastro',
    mensagemCadastro: 'mensagem-cadastro',
    cadastro: 'cadastro',
    inputTempoSeg: 'tempo-segundos',
};

export const classes = {
  resposta: 'container-resposta',
  botaoCadastrarNova: 'botao-cadastrar-nova',
  mensagemSucesso: 'mensagem-sucesso',
  botaoVoltar: 'botao-voltar',
  containerSucesso: 'container-sucesso',
  labelCorreta: 'label-resposta-correta',
};

export const names = {
  respostaCorreta : 'resposta-correta'
}

export const idsCss = Object.fromEntries(
  Object.entries(ids).map(([c, id]) => [c, `#${id}`])
);

export const classesCss = Object.fromEntries(
  Object.entries(classes).map(([c, classe]) => [c, `.${classe}`])
);