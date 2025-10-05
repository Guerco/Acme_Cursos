const API_SIMULADA = true;

const BASE_URL_API = API_SIMULADA ? 'http://localhost:3000/' : 'http://localhost:8080/';
const BASE_URL_WEB = 'http://localhost:5173/'

export const rotasApi = {
    index: BASE_URL_API,
    cursos: BASE_URL_API+'cursos/'
};

export const rotasPaginas = {
    listagemCursos: BASE_URL_WEB
}