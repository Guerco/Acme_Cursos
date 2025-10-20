Funcionalidade: Quiz
    Como um aluno
    Eu desejo poder responder perguntas sobre um assunto
    Para poder ganhar pontos no quiz.

    Cenário: Página exige credenciais ao abrir
        Dado que acesso a tela de quiz
        Quando visualizo a tela
        Então há uma caixa solicitando o preenchimento das credenciais.

    Cenário: Caixa de credenciais fecha ao informar credenciais corretas
        Dado que acesso a tela de quiz
        Quando preencho credenciais corretas na tela que se abre
            E clico em enviar
        Então a caixa de credenciais se fecha.

    Cenário: Caixa de credenciais informa se preencher credenciais erradas
        Dado que acesso a tela de quiz
        Quando preencho credenciais incorretas na tela que se abre
            E clico em enviar
        Então a uma mensagem é exibida informando que as credenciais são inválidas