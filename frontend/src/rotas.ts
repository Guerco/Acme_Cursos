const BASE_URL_API = 'http://localhost:8080/';
const BASE_URL_JSON_SERVER = 'http://localhost:3000/';
const BASE_URL_WEB = 'http://localhost:5173/';

export const rotasApi = {
    index: BASE_URL_API,
    cursos: BASE_URL_API+'cursos/',
    cursosBusca: BASE_URL_API+'cursos/?busca=',
    verificarCredenciais: BASE_URL_API + 'alunos/verificarCredenciais',
    buscarPerguntas: ( idAluno: number, idAssunto: number) =>
        BASE_URL_API + 'assuntos/' + idAssunto + '/perguntas?id_aluno=' + idAluno,
    buscarPontuacao: ( idAluno: number, idCurso: number) =>
        BASE_URL_API + 'alunos/' + idAluno + '/pontuacaoCurso/?id_curso=' + idCurso,
    enviarResposta: BASE_URL_API+'respostasAluno/'
};

export const rotasPaginas = {
    listagemCursos: BASE_URL_WEB,
    quiz: BASE_URL_WEB+'pages/quiz.html',
    erro: BASE_URL_WEB+'pages/erro.html',
    cadastroPerguntas: BASE_URL_WEB+'pages/cadastro-perguntas.html',
};

export const rotasJsonServer = {
    index: BASE_URL_JSON_SERVER,
    cursos: BASE_URL_JSON_SERVER+'cursos/',
    professores: BASE_URL_JSON_SERVER+'professores/',
    perguntas: BASE_URL_JSON_SERVER+'perguntas/',
}