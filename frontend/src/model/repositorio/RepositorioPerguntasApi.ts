import { RepositorioPerguntas } from "./RepositorioPerguntas";
import { PerguntaListagem } from "../dto/PerguntaListagem";
import { PerguntaListagemQuiz } from "../dto/PerguntaListagemQuiz";
import { rotasApi } from "../../rotas";
import { PerguntaCadastro } from "../dto/PerguntaCadastro";
import { DominioException } from "../exception/DominioException";

export class RepositorioPerguntasApi implements RepositorioPerguntas {

    async buscarPerguntas(idAluno: number, idAssunto: number): Promise<PerguntaListagemQuiz[]> {
        try {
            const response = await fetch(rotasApi.buscarPerguntas(idAluno, idAssunto));

            if (response.status >= 400 && response.status < 500) {
                throw DominioException.comProblemas((await response.json()).erros);
            }
            else if (!response.ok) {
                throw new Error();
            }

            const perguntas = await response.json();
            return perguntas.map((p : any) => 
                new PerguntaListagemQuiz(
                    p.id,
                    p.descricao,
                    p.caminhoImg,
                    p.tempoSeg,
                    p.dificuldade,
                    p.respostas
                )
        );
        } catch (error) {
            if (error instanceof DominioException) throw error;
            else throw new Error('Não foi possível buscar as perguntas.');
        }
    }

    async enviarPergunta(pergunta: PerguntaCadastro) {
        try {            
            const response = await fetch(rotasApi.perguntas, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pergunta)
            });

            if (!response.ok) {
                if (response.status >= 400 && response.status < 500) {
                    const body = await response.json();
                    throw DominioException.comProblemas(body.erros)
                } else throw new Error();
            }
        } catch (error) {
            if (error instanceof DominioException) {
                throw error;
            }
            
            throw new Error('Não foi possível salvar a pergunta.');
        }
    }

    async buscarTodosOuPorAssunto(idAssunto: number|null = null): Promise<PerguntaListagem[]> {
        try {
            const url = rotasApi.perguntas + (idAssunto ? `?id_assunto=${idAssunto}`: '');

            const response = await fetch(url);

            if (!response.ok){
                if (response.status >= 400 && response.status < 500) {
                    const body = await response.json();
                    throw DominioException.comProblemas(body.erros)
                } else throw new Error();
            }

            const resultado = await response.json();
            if ('mensagem' in resultado)
                throw new DominioException(resultado.mensagem);
            return resultado.map((p: any) => new PerguntaListagem(
                p.descricao,
                p.caminhoImg,
                p.tempoSeg,
                p.dificuldade,
                p.descricaoAssunto,
                p.ultimaAtualizacao,
                p.respostas
            ));
        } catch(err) {
            if (err instanceof DominioException) {
                throw err;
            }

            throw new Error('Não foi possível buscar as perguntas.');
        }
    }
}