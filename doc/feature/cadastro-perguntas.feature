Funcionalidade: Cadastro de Perguntas
    Como um professor/administrador
    Eu desejo poder cadastrar uma pergunta de determinado assunto
    Para que os alunos possam respondê-la.

    Cenário: Cadastro preenche a lista de professores ao abrir
        Dado que acesso a tela de cadastro de pergunta
        Quando visualizo a tela
        Então há pelo menos um professor listado na seleção.
    
    Cenário: Cadastro preenche a lista de cursos ao selecionar o professor
        Dado que acesso a tela de cadastro de pergunta
        Quando seleciono um professor
        Então a seleção de cursos é habilitada
            E há pelo menos um curso listado na seleção.

    Cenário: Cadastro preenche a lista de assuntos ao selecionar o curso
        Dado que acesso a tela de cadastro de pergunta
        Quando seleciono um professor
        e seleciono um curso
        Então a seleção de assuntos é habilitada
            E há pelo menos um assunto listado na seleção.

    Cenário: Cadastro permite a seleção de dificuldade
        Dado que acesso a tela de cadastro de pergunta
        Quando visualizo a tela
        Então há uma seleção de nível de dificuldade
            E há as opções Fácil, Médio e Difícil.

    Cenário: Cadastro permite aumentar o número de respostas
        Dado que acesso a tela de cadastro de pergunta
        Quando clico em adicionar resposta
        Então a terceira caixa de resposta fica visível.

    Cenário: Cadastro permite no máximo cinco respostas
        Dado que acesso a tela de cadastro de pergunta
        Quando clico em adicionar resposta três vezes
        Então o botão de adicionar resposta é desabilitado.

    Cenário: Cadastro permite no mínimo duas respostas
        Dado que acesso a tela de cadastro de pergunta
        Quando visualizo a tela
        Então o botão de remover resposta é desabilitado.

    Cenário: Cadastro permite diminuir o número de respostas
        Dado que acesso a tela de cadastro de pergunta
        Quando clico em adicionar resposta
             e clico em remover resposta
        Então a terceira caixa de resposta fica invisível.

    Cenário: Cadastro exige no mínimo uma resposta correta
        Dado que acesso a tela de cadastro de pergunta
           E apenas a resposta um está marcada como correta
        Quando tento desmarcar essa resposta
        Então a resposta permanece marcada como correta.
    
    Cenário: Cadastro impede marcar todas as respostas como corretas
        Dado que acesso a tela de cadastro de pergunta
           E apenas a resposta um está marcada como correta
        Quando eu marco a segunda resposta como correta
        Então a resposta um é desmarcada.

    Cenário: Cadastro permite preencher o enunciado
        Dado que acesso a tela de cadastro de pergunta
        Quando visualizo a tela
        Então há um campo para preencher o enunciado da pergunta.

    Cenário: Cadastro limita tamanho máximo do enunciado
        Dado que acesso a tela de cadastro de pergunta
        Quando tento preencher o enunciado com mais de 255 caracteres
        Então o campo não aceita mais caracteres além do máximo.
