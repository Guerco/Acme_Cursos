import { RespositorioAlunos } from "./RepositorioAlunos";
import { rotasApi } from "../../rotas";
import { AlunoListagem } from "../dto/AlunoListagem";
import { Credenciais } from "../dto/Credenciais";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";
import { DominioException } from "../exception/DominioException";
import { AlunoRel } from "../dto/relatorio/AlunoRel";
import { AlunoCursoRel } from "../dto/relatorio/AlunoCursoRel";

export class RepositorioAlunosAPI implements RespositorioAlunos {

    async verificarCredenciais(credenciais: Credenciais): Promise<AlunoListagem> {
        try {
            const response = await fetch(rotasApi.verificarCredenciais, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credenciais)
            });

            if (response.status >= 400 && response.status < 500) {
                throw new DominioException('Credenciais Inválidas.');
            }
            else if (!response.ok) {
                throw new Error();
            } else {
                const aluno = await response.json();
                return new AlunoListagem(
                    aluno.id, 
                    aluno.nome, 
                    aluno.pontuacaoGeral
                );
            }
        } catch (err: any) {
            if (err instanceof DominioException)
                throw err;
            else
                throw new Error('Não foi possível verificar as crecenciais.');
        }
    }

    async buscarPontuacaoAlunoCurso(idAluno: number, idCurso: number): Promise<number>{
        try{
             const response = await fetch(rotasApi.buscarPontuacao(idAluno, idCurso));

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            return data.pontuacao; 
        }catch(error){
            throw new Error('Não foi possível buscar a pontuação do aluno');
        }
    }

    async enviarResposta(respostaAluno: RespostaAlunoCadastro): Promise<boolean>{
        try{
            const response = await fetch(rotasApi.enviarResposta, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(respostaAluno)
            });

            if (!response.ok) {
                throw new Error();
            }
            
            const body = await response.json();
            
            return body.respostaCorreta;
        } catch(error){
            throw error;
        }
    }

    async buscarRankingAlunos() : Promise<AlunoRel[]> {
        return [];
    } 

    async buscarRankingAlunosCurso() : Promise<AlunoCursoRel[]> {
        return [];
    } 
}