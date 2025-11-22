import { RespositorioAlunos } from "./RepositorioAlunos";
import { rotasApi } from "../../rotas";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";
import { DominioException } from "../exception/DominioException";
import { AlunoRel } from "../dto/relatorio/AlunoRel";
import { AlunoCursoRel } from "../dto/relatorio/AlunoCursoRel";
import { PontuacoesAluno } from "../dto/PontuacoesAluno";

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
                throw new Error();
            }
            
            const body = await response.json();
            
            return body.respostaCorreta;
        } catch(error){
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
                throw new Error();
            }
            
            const body = await response.json();
            
            return new PontuacoesAluno(
                body.descricaoAssunto,
                Number(body.pontuacaoGeral),
                Number(body.pontuacaoCurso)
            );
        } catch(error){
            throw new Error('Não foi possível buscar as Pontuações.');
        }
    }
    

    async buscarRankingAlunos() : Promise<AlunoRel[]> {
        return [];
    } 

    async buscarRankingAlunosCurso() : Promise<AlunoCursoRel[]> {
        return [];
    } 
}