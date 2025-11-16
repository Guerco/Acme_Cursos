Funcionalidade: Cadastro de usuário
    Como um Administrador
    Eu desejo poder cadastrar um usuário
    Para que ele possa ter acesso ao sistema de Quiz

    Cenário: Mostra a lista de tipos de usuários
        Dado que acesso a tela cadastro de usuário
        Quando visualizo a tela
        Então lista o tipo de usuário Aluno, Professor e Administrador

    Cenário: Mostra a senha
        Dado que acesso a tela cadastro de usuário
        Quando clico no botão do emoji
        A senha deve ficar visível;

    Cenário: Esconde a senha
        Dado que acesso a tela cadastro de usuário
            E a senha está visível
        Quando clico no botão do emoji
        A senha deve ficar escondida novamente;

    Cenário: Cadastro exige um tamanho mínimo para o nome
        Dado que acesso a tela cadastro de usuário
        Quando tento preencher o nome com menos de 2 caracteres
        E clico no botão enviar
        Então o campo não vai aceitar essa quantidade.

    Cenário: Cadastro exige um tamanho máximo para o nome
        Dado que acesso a tela cadastro de usuário
        Quando tento preencher o nome com mais de 100 caracteres
        Então o campo não vai aceitar essa quantidade.

    Cenário: Cadastro exige um tamanho mínimo para o email
        Dado que acesso a tela cadastro de usuário
        Quando tento preencher o email com menos de 3 caracteres
        E clico no botão enviar
        Então o campo não vai aceitar essa quantidade.

    Cenário: Cadastro exige um tamanho máximo para o email
        Dado que acesso a tela cadastro de usuário
        Quando tento preencher o email com mais de 100 caracteres
        Então o campo não vai aceitar essa quantidade.

    Cenário: Cadastro exige um tamanho mínimo para a senha
        Dado que acesso a tela cadastro de usuário
        Quando tento preencher uma senha com menos de 6 caracteres
        E clico no botão enviar
        Então o campo não vai aceitar essa quantidade.
    


