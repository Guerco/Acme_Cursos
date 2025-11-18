export const ids = {
    tabelaRel: 'tabela-relatorio',
    selectRanking: 'tipo-ranking',
    busca: 'form-busca',
    inputBusca: 'input-busca',
};

export const classes = {
  trCurso: 'tr-curso',
  trAluno: 'tr-aluno',
  mensagem: 'mensagem',
};

export const values = {
  curso : 'pontuacao-curso',
}

export const idsCss = Object.fromEntries(
  Object.entries(ids).map(([c, id]) => [c, `#${id}`])
);

export const classesCss = Object.fromEntries(
  Object.entries(classes).map(([c, classe]) => [c, `.${classe}`])
);