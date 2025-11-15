export const ids = {
    mensagem: 'mensagem',
    secaoPerguntas: 'secao-perguntas',
};

export const classes = {
    pergunta: 'card-pergunta',
    descricaoPergunta: 'descricao-pergunta',
    descricaoAssunto: 'descricao-assunto',
    dificuldade: 'dificuldade',
    tempoSeg: 'tempo-seg',
    ultimaAtualizacao: 'ultima-atualizacao',
    containerPergunta: 'container-pergunta',
    infoPergunta: 'info-pergunta',
    containerRespostas: 'container-respostas',
    tabelaRespostas: 'tabela-respostas',
    descricaoResposta: 'descricao-resposta',
    tituloRespostaCorreta: 'titulo-resposta-correta',
    tituloDescricaoResposta: 'titulo-descricao-resposta',
    respostaCorreta: 'resposta-correta',
    linhaResposta: 'tr-resposta',
    perguntaAcoes: 'pergunta-acoes',
    botaoExibirRespostas: 'botao-exibir-resposta',
    detalhesPergunta: 'detalhes-pergunta',
    aberto: 'aberto',
    scroll: 'scroll'
};

export const idsCss = Object.fromEntries(
    Object.entries(ids).map(([c, id]) => [c, `#${id}`])
);

export const classesCss = Object.fromEntries(
    Object.entries(classes).map(([c, classe]) => [c, `.${classe}`])
);