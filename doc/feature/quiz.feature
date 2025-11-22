Funcionalidade: Quiz
    Como um aluno
    Eu desejo poder responder perguntas sobre um assunto
    Para poder ganhar pontos no quiz.

    Cenário: Pergunta é exibida ao informar  as credenciais
        Dado que acesso a tela de quiz
        Quando clico em iniciar quiz
        Então uma pergunta é exibida na tela de quiz.

    Cenário: Informações do aluno são exibidas
        Dado que acesso a tela de quiz
        Quando clico em iniciar quiz
        Então o cabeçalho exibe a pontuação geral do aluno
            e sua pontuação no curso em questão.

    Cenário: Quiz reconhece respostas corretas
        Dado que acesso a tela de quiz
        Quando clico em iniciar quiz
            E seleciono as respostas corretas
            E clico em responder
        Então uma mensagem é exibida informando que acertei.

    Cenário: Quiz reconhece respostas incorretas
        Dado que acesso a tela de quiz
        Quando clico em iniciar quiz
            E seleciono respostas incorretas
            E clico em responder
        Então uma mensagem é exibida informando que errei.

    Cenário: Apresenta mensagem quando acaba as perguntas
        Dado que acesso a tela de quiz
        Quando preencho credenciais corretas na tela que se abre
            E clico em enviar
            Se não houver mais perguntas para aquele quiz
        Então uma mensagem é exibida informando que não há mais perguntas.

    Cenário: Quiz se encerra ao sair de tela cheia
        Dado que acesso a tela de quiz
        Quando clico em iniciar quiz
            E saio de tela cheia
        Então uma mensagem é exibida informando que o quiz se encerrou.