export const ids = {
    mensagem: '#mensagem'
};

export const classes = {
    
}

export const classesCss = Object.fromEntries(
    Object.entries(classes).map(([c, classe]) => [c, `.${classe}`])
);