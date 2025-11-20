export const ids = {
    mensagem: 'mensagem',
    tipoUsuario: 'tipo-usuario',
    formBusca: 'form-busca',
    inputBusca: 'input-busca',
};

export const classes = {
    infoUsuario: 'info-usuario',
    emailUsuario: 'email-usuario',
    tituloCargo: 'titulo-cargo',
}

export const classesCss = Object.fromEntries(
    Object.entries(classes).map(([c, classe]) => [c, `.${classe}`])
);