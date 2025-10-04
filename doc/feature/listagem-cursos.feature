Funcionalidade: Listagem de Cursos
    Como um aluno
    Eu desejo poder ver os cursos existentes
    Para poder acessar os Quizes de seus assuntos.

    Cenário: Listagem apresenta pelo menos um curso ao abrir
        Dado que acesso a tela de listagem de cursos
        Quando visualizo a tela
        Então há pelo menos um curso sendo listado.

    Cenário: Listagem apresenta um curso ao buscar por parte de seu nome
        Dado que acesso a tela de listagem de cursos
        Quando digito parte do nome de um curso na caixa de pesquisa 
             e aperto o botão enter
        Então apenas cursos que satisfaçam aquele filtro são listados. 

    Cenário: Listagem apresenta os assuntos de um curso ao clicar em seu card
        Dado que acesso a tela de listagem de cursos
        Quando clico no card de um curso
        Então o carde se expande e lista os assuntos do curso em questão.

    Cenário: Listagem não apresenta cursos ao buscar por um texto inexistente no nome de nenhum curso ou professor
        Dado que acesso a tela de listagem de cursos
        Quando digito um texto inexistente na caixa de pesquisa 
             e aperto o botão enter
        Então uma mensagem de que não há cursos para se listar será exibida.

        