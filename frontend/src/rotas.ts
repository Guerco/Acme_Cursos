const BASE_URL_API = 'http://localhost:8080/';
const BASE_URL_JSON_SERVER = 'http://localhost:3000/';
const BASE_URL_WEB = 'http://localhost:5173/';

export const rotasApi = {
    index: BASE_URL_API,
    cursos: BASE_URL_API+'cursos/',
    cursosBusca: BASE_URL_API+'cursos/?busca=',
    verificarCredenciais: BASE_URL_API + 'alunos/verificarCredenciais',
    buscarPerguntas: ( idAluno: number, idAssunto: number) =>
        BASE_URL_API + 'assuntos/' + idAssunto + '/perguntas?id_aluno=' + idAluno
};

export const rotasPaginas = {
    listagemCursos: BASE_URL_WEB,
    quiz: BASE_URL_WEB+'pages/quiz.html'
};

export const rotasJsonServer = {
    index: BASE_URL_JSON_SERVER,
    cursos: BASE_URL_JSON_SERVER+'cursos/',
}