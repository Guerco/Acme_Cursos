import { TipoUsuario } from "../../model/TipoUsuario";
import { rotasPaginas } from "../../rotas";

export type ItemMenu = {
    rota?: string;
    descricao?: string;
    linha?: boolean;
    subMenu?: ItemMenu[];
    autorizados?: string[];
    logado?: boolean;
};

export const ELEMENTOS_MENU: ItemMenu[] = [
    { linha:true },
    {
        rota: rotasPaginas.listagemCursos,
        descricao: 'Listagem de Cursos 🎓'
    },
    {
        rota: rotasPaginas.listagemPerguntas,
        descricao: 'Listagem de Perguntas ❔',
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]
    },
    {
        rota: rotasPaginas.listagemUsuarios,
        descricao: 'Listagem de Usuários 👥',
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]
    },
    { linha: true,
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ] },
    {
        rota: rotasPaginas.cadastroPerguntas,
        descricao: 'Cadastro de Perguntas ❓',
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]
    },
    {
        rota: rotasPaginas.cadastroUsuario,
        descricao: 'Cadastro de Usuários 👤',
        autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]
    },
    { linha: true, logado: true, autorizados: [
            TipoUsuario.ADMINISTRADOR,
            TipoUsuario.PROFESSOR,
            TipoUsuario.PROFESSOR_ADMINISTRADOR,
        ]},
    {
        logado: true,
        descricao: 'Relatórios 📊',
        subMenu: [
            {
                rota: rotasPaginas.rankingAlunos,
                descricao: 'Top Alunos 🏅'
            },
            {
                rota: rotasPaginas.listagemCursos,
                descricao: 'Total Alunos Curso 📚',
                autorizados: [
                    TipoUsuario.ADMINISTRADOR,
                    TipoUsuario.PROFESSOR,
                    TipoUsuario.PROFESSOR_ADMINISTRADOR,
                ] 
            }
        ]
    },
    { linha:true }
];