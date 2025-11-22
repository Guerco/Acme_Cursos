Funcionalidade: Login
    Como um usuário
    Eu desejo poder realizar o login
    Para poder utilizar a aplicação.

    Cenário: Caixa de credenciais abre ao clicar em entrar
        Dado que acesso a tela inicial
        Quando clico em entrar
        Então a caixa de credenciais se abre.

    Cenário: Caixa de credenciais informa ao preencher credenciais erradas
        Dado que acesso a tela inicial
           E clico em entrar
        Quando preencho credenciais incorretas na tela que se abre
             E clico em enviar
        Então a uma mensagem é exibida informando que as credenciais são inválidas.

    Cenário: Caixa de credenciais fecha ao informar credenciais corretas
        Dado que acesso a tela inicial
           E clico em entrar
        Quando preencho credenciais corretas na tela que se abre
             E clico em enviar
        Então a caixa de credenciais se fecha.

    Cenário: Nome do usuário é preenchido ao informar credenciais corretas
        Dado que acesso a tela inicial
           E clico em entrar
        Quando preencho credenciais corretas na tela que se abre
             E clico em enviar
        Então meu nome é preenchido no cabeçalho.

    Cenário: Login exige email em formato correto
        Dado que acesso a tela inicial
           E clico em entrar
        Quando preencho um email com formato incorreto
             E clico em enviar
        Então o form não vai aceitar aquele campo.