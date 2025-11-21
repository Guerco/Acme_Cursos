export const classes = {
    cabecalho: 'cabecalho',
    logo: 'logotipo',
    icon: 'icone',
    visivel: 'visivel',
    scroll: 'scroll',
    menuLateral: 'menu-lateral',
    fundoEscuro: 'fundo-escuro',
    logoCredenciais: 'logo-credenciais',
    inputCredenciais: 'inputs-credenciais',
    botaoSenha: 'botao-exibir-senha',
    acoesCredenciais: 'acoes-credenciais',
    itensMenu: 'itens-menu',
    submenu: 'sub-menu',
    linha: 'linha-menu',
    infoUsuario: 'info-usuario',
    nomeUsuario: 'nome-usuario-menu',
    tipoUsuario: 'tipo-usuario-menu',
    botaoEntrar: 'botao-entrar',
    botaoSair: 'botao-sair',
    acoesUsuario: 'acoes-usuario',
    nomeUsuarioHeader: 'nome-usuario-header',
    entrarCabecalho: 'botao-entrar-cabecalho',
};

export const ids = {
    logoMenu: 'logo-menu',
    caixaCredenciais: 'caixa-credenciais',
    formCredenciais: 'form-credenciais',
    email: 'email-login',
    senha: 'senha-login',
    botaoEnviar: 'botao-enviar-login',
    botaoCancelar: 'botao-cancelar-login',
    mensagemLogin: 'mensagem-login',
}

export const idsCss = Object.fromEntries(
    Object.entries(ids).map(([c, id]) => [c, `#${id}`])
);