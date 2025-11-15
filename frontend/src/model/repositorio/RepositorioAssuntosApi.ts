import { rotasApi } from "../../rotas";
import { AssuntoListagem } from "../dto/AssuntoListagem";
import { RepositorioAssuntos } from "./RepositorioAssuntos";

export class RepositorioAssuntosApi implements RepositorioAssuntos {
    async buscarPorIdCurso(idCurso: number): Promise<AssuntoListagem[]> {
        try {
            const response = await fetch(rotasApi.assuntosCurso(idCurso));

            if (!response.ok) {
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
            throw new Error('Não foi possível buscar os assuntos.');
        }
    }
}
