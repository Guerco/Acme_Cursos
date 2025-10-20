import { RespositorioAlunos } from "./RepositorioAlunos";
import { rotasApi } from "../../rotas";
import { AlunoListagem } from "../dto/AlunoListagem";
import { Credenciais } from "../dto/Credenciais";

export class RepositorioAlunosAPI implements RespositorioAlunos{

     async verificarCredenciais(credenciais: Credenciais) : Promise<AlunoListagem>{

        try {
            const response = await fetch(rotasApi.verificarCredenciais, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credenciais) 
            });

            if (response.status == 404) {
                throw new Error('Credenciais Inválidas');
            }
            else if (!response.ok) {
                throw new Error('Erro ao validar as credenciais.');
            } else {
                const aluno = await response.json();
                return aluno;
            }    
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}