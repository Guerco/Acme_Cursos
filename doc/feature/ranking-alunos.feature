Funcionalidade: Ranking de Alunos
    Como um aluno
    Eu desejo poder ver um relatório com os alunos de melhor pontuação
    Para poder ver o desempenho em relação aos demais.

    Cenário: Relatório exibe a lista de Alunos de melhor pontuação geral
        Dado que acesso a tela de ranking de alunos
        Quando visualizo a tela
        Então há pelo menos um aluno listado no ranking.

    Cenário: Relatório exibe a lista de Alunos de melhor pontuação por curso
        Dado que acesso a tela de ranking de alunos
        Quando seleciono a opção ranking por curso
        Então há pelo menos um curso listado no ranking.