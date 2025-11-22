import { rotasApi } from "../../rotas";
import { AssuntoListagem } from "../dto/AssuntoListagem";
import { NaoAutorizadoException } from "../exception/NaoAutorizadoException";
import { RepositorioAssuntos } from "./RepositorioAssuntos";

export class RepositorioAssuntosApi implements RepositorioAssuntos {
    async buscarPorIdCurso(idCurso: number): Promise<AssuntoListagem[]> {
        try {
            const response = await fetch(rotasApi.assuntosCurso(idCurso), {
                    credentials: 'include' 
            });
            
            if (!response.ok) {
                if (response.status == 401)
                    throw new NaoAutorizadoException('Ops, parece que você não tem acesso a esse recurso.');
                throw new Error();
            }
            const assuntos = await response.json();
            return assuntos.map((a : any) => 
                new AssuntoListagem(
                    a.id,
                    a.descricao
                )
            );
        } catch (err) {
            if (err instanceof NaoAutorizadoException) throw err;
            throw new Error('Não foi possível buscar os assuntos.');
        }
    }
}
