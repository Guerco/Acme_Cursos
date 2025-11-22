import { rotasApi, rotasJsonServer } from "../../rotas";
import { CursoListagem } from "../dto/CursoListagem";
import { CursoListagemResumo } from "../dto/CursoListagemResumo";
import { NaoAutorizadoException } from "../exception/NaoAutorizadoException";
import { RepositorioCursos } from "./RepositorioCursos";
import { CursoQtdAlunoRel } from "../dto/relatorio/CursoQtdAlunoRel";


export class RepositorioCursosApi implements RepositorioCursos  {
    async buscarTodos() : Promise<CursoListagem[]>{
        try {
            const response = await fetch(rotasApi.cursos);
        
            if (!response.ok){
                throw new Error();
            }
            const cursos = await response.json();
            return cursos.map((c : any)  => 
                new CursoListagem(
                    c.id, 
                    c.descricao, 
                    c.caminhoImg, 
                    c.nomeProfessor, 
                    c.assuntos
                )
            );
        } catch(err) {
            throw new Error('Não foi possível buscar os cursos.');
        }
    }
    
    async buscarPorDescricaoOuProfessor(filtro : string) : Promise<CursoListagem[]>{
        try {
            const response = await fetch(rotasApi.cursosBusca+filtro);

            if (!response.ok){
                throw new Error();
            }

            const cursos = await response.json();
            return cursos.map((c : any)  => 
                new CursoListagem(
                    c.id, 
                    c.descricao, 
                    c.caminhoImg, 
                    c.nomeProfessor, 
                    c.assuntos
                )
            );
        } catch(err) {
            throw new Error('Não foi possível buscar os cursos filtrados.');
        }
    }

    async buscarResumidoPorIdProfessor(idProfessor : number) : Promise<CursoListagemResumo[]>{
        try {
            const response = await fetch(rotasApi.cursosProfessor(idProfessor), 
                { 
                    method: 'GET', 
                    credentials: 'include' 
                }
            );

            if (!response.ok){
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            const cursos = await response.json();
            return cursos.map((c : any) => new 
                CursoListagemResumo(
                    c.id,
                    c.descricao
                )
            );
        } catch(err) {
            if (err instanceof NaoAutorizadoException) throw err;
            throw new Error('Não foi possível buscar os cursos.');
        }
    }

    async buscarNumeroDeAlunosPorCurso() : Promise<CursoQtdAlunoRel[]> {
            try{
                const response = await fetch(rotasApi.numeroDeAlunosPorCurso, 
                    { 
                        method: 'GET', 
                        credentials: 'include' 
                    }
                );

                if (!response.ok){

                    if (response.status == 401)
                            throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                        throw new Error();
                }
                    
                const body = await response.json();
    
                return body.map((b : any)  => 
                                new CursoQtdAlunoRel(
                                b.descricao,
                                Number(b.quantidade)
                            )
                        );
                
            } catch(error){
                if (error instanceof NaoAutorizadoException) throw error;
                throw new Error('Não foi possível listar o número de alunos por curso.');
            }
        } 
    
}