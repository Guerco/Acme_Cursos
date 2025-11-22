import { RespositorioAlunos } from "./RepositorioAlunos";
import { rotasApi } from "../../rotas";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";
import { DominioException } from "../exception/DominioException";
import { AlunoRel } from "../dto/relatorio/AlunoRel";
import { AlunoCursoRel } from "../dto/relatorio/AlunoCursoRel";
import { PontuacoesAluno } from "../dto/PontuacoesAluno";
import { NaoAutorizadoException } from "../exception/NaoAutorizadoException";

export class RepositorioAlunosAPI implements RespositorioAlunos {
    async enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean>{
        try{
            const response = await fetch(rotasApi.enviarResposta, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' ,
                    body: JSON.stringify(respostaAluno)
            });

            if (!response.ok) {
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            
            const body = await response.json();
            
            return body.respostaCorreta;
        } catch(error){
            if (error instanceof NaoAutorizadoException) throw error;
            throw new Error('Não foi possível salvar a Resposta.');
        }
    }

    async buscarPontuacoesAluno(idAssunto: number) : Promise<PontuacoesAluno>{
        try{
            const response = await fetch(rotasApi.buscarPontuacao(idAssunto), 
                { 
                    method: 'GET', 
                    credentials: 'include' 
                }
            );

            if (!response.ok) {
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            
            const body = await response.json();
            
            return new PontuacoesAluno(
                body.descricaoAssunto,
                Number(body.pontuacaoGeral),
                Number(body.pontuacaoCurso)
            );
        } catch(error){
            if (error instanceof NaoAutorizadoException) throw error;
            throw new Error('Não foi possível buscar as Pontuações.');
        }
    }
    

    async buscarRankingAlunos(filtro: string) : Promise<AlunoRel[]> {
        try{
            const response = await fetch(rotasApi.rankingPorPontuacaoGeral(filtro), 
                { 
                    method: 'GET', 
                    credentials: 'include' 
                }
            );

            if (!response.ok) {
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            
            const body = await response.json();

            return body.map((b : any)  => 
                            new AlunoRel(
                            Number(b.posicao),
                            b.nome,
                            Number(b.pontuacaoGeral)
                        )
                    );
            
        } catch(error){
            if (error instanceof NaoAutorizadoException) throw error;
            throw new Error('Não foi possível listar o raking de alunos.');
        }
    } 

    async buscarRankingAlunosCurso(filtro: string) : Promise<AlunoCursoRel[]> {
        try{
            const response = await fetch(rotasApi.rankingAlunosPorCurso(filtro), 
                { 
                    method: 'GET', 
                    credentials: 'include' 
                }
            );

            if (!response.ok) {
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            
            const body = await response.json();

            return body.map((b : any)  => 
                            new AlunoCursoRel(
                            b.descricao,
                            Number(b.posicao),
                            b.nomeAluno,
                            Number(b.pontuacao)
                        )
                    );
            
        } catch(error){
            if (error instanceof NaoAutorizadoException) throw error;
            throw new Error('Não foi possível listar o raking de alunos por curso.');
        }
    } 

    async buscarQuizAleatorio() : Promise<number> {
        try{
            const response = await fetch(rotasApi.quizAleatorio, 
                { 
                    method: 'GET', 
                    credentials: 'include' 
                }
            );

            if (!response.ok) {
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            
            const body = await response.json();

            console.log(body);
            return body.idAssunto;
        } catch(error){
            if (error instanceof NaoAutorizadoException) throw error;
            throw new Error('Não foi possível buscar um assunto aleatório.');
        }
    } 
}