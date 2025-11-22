const BASE_URL_API = 'http://localhost:8080/';
const BASE_URL_JSON_SERVER = 'http://localhost:3000/';
const BASE_URL_WEB = 'http://localhost:5173/';

export const rotasApi = {
    index: BASE_URL_API,
    cursos: BASE_URL_API+'cursos/',
    cursosBusca: BASE_URL_API+'cursos/?busca=',
    verificarCredenciais: BASE_URL_API + 'alunos/verificarCredenciais',
    buscarPerguntas: ( idAssunto: number) =>
        BASE_URL_API + 'assuntos/' + idAssunto + '/perguntas/',
    buscarPontuacao: ( idAssunto: number) =>
        BASE_URL_API + 'alunos/pontuacoes/?id_assunto=' + idAssunto,
    enviarResposta: BASE_URL_API+'alunos/respostas/',
    imagensCursos: BASE_URL_API+'img/cursos/',
    imagensPerguntas: BASE_URL_API+'img/perguntas/',
    professores: BASE_URL_API+'professores/',
    cursosProfessor: ( idProfessor: number ) =>
        BASE_URL_API + 'professores/' + idProfessor + '/cursos/',
    assuntosCurso: ( idCurso: number ) =>
        BASE_URL_API + 'cursos/' + idCurso + '/assuntos/',
    perguntas: BASE_URL_API+'perguntas/',
    usuarios: BASE_URL_API+'usuarios/',
    usuariosBusca: ( busca: string ) =>
        BASE_URL_API+'usuarios/?busca=' + busca,
    login: BASE_URL_API+'login/',
    rankingPorPontuacaoGeral: (busca: string) =>
        BASE_URL_API + 'relatorios/rankingPorPontuacaoGeral?busca=' + busca,
    rankingAlunosPorCurso: (busca: string) =>
        BASE_URL_API + 'relatorios/rankingAlunosPorCurso?busca=' + busca,
    numeroDeAlunosPorCurso:
    BASE_URL_API + 'relatorios/numeroDeAlunosPorCurso',
    quizAleatorio: BASE_URL_API+'alunos/quizAleatorio/', 
};

export const rotasPaginas = {
    listagemCursos: BASE_URL_WEB,
    quiz: BASE_URL_WEB+'pages/quiz.html',
    erro: BASE_URL_WEB+'pages/erro.html',
    rankingAlunos: BASE_URL_WEB+'pages/ranking-alunos.html',
    cadastroUsuario: BASE_URL_WEB+'pages/cadastro-usuario.html',
    listagemUsuarios: BASE_URL_WEB+'pages/listagem-usuario.html',
    cadastroPerguntas: BASE_URL_WEB+'pages/cadastro-perguntas.html',
    listagemPerguntas: BASE_URL_WEB+'pages/listagem-perguntas.html',
    numeroDeAlunosPorCurso: BASE_URL_WEB+'pages/alunos-cursos.html'
};

export const rotasJsonServer = {
    index: BASE_URL_JSON_SERVER,
    cursos: BASE_URL_JSON_SERVER+'cursos/',
    perguntas: BASE_URL_JSON_SERVER+'perguntas/',
    professores: BASE_URL_JSON_SERVER+'professores/',
    perguntasListagem: BASE_URL_JSON_SERVER+'perguntasListagem/'
}