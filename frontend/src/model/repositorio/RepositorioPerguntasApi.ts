import { RepositorioPerguntas } from "./RepositorioPerguntas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { rotasApi } from "../../rotas";

export class RepositorioPerguntasApi implements RepositorioPerguntas{

    async buscarPerguntas(idAluno: number, idAssunto: number): Promise <PerguntaListagem[]>{
        try {
            const response = await fetch(rotasApi.buscarPerguntas(idAluno, idAssunto));
            
            if (!response.ok) {
                throw new Error();
            }
            
            const perguntas =  await response.json();
            return perguntas;
        } catch (error: any) {
            //throw new Error('Erro ao buscar as perguntas.');
            throw new Error(error.message);
        }
}

}