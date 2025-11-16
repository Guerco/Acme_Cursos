export const ids = {
    mensagem: '#mensagem'
};

export const classes = {
    infoUsuario: 'info-usuario',
    emailUsuario: 'email-usuario',
    tituloCargo: 'titulo-cargo',
}

export const classesCss = Object.fromEntries(
    Object.entries(classes).map(([c, classe]) => [c, `.${classe}`])
);