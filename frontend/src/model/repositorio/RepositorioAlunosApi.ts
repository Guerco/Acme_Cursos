import { RespositorioAlunos } from "./RepositorioAlunos";
import { rotasApi } from "../../rotas";
import { AlunoListagem } from "../dto/AlunoListagem";
import { Credenciais } from "../dto/Credenciais";
import { RespostaAlunoCadastro } from "../dto/RespostaAlunoCadastro";

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

            if (response.status == 404 && await response.text() == 'Credenciais inválidas.') {
                throw new Error('Credenciais Inválidas.');
            }
            else if (!response.ok) {
                throw new Error();
            } else {
                const aluno = await response.json();
                return aluno;
            }
        } catch (err: any) {
            if (err.message == 'Credenciais Inválidas.')
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
            throw new Error('Não foi possível salvar a resposta.');
        }
    }
        
}