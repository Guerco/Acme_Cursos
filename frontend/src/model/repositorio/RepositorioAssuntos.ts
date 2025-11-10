import { AssuntoListagem } from "../dto/AssuntoListagem";

export interface RepositorioAssuntos {
    buscarPorIdCurso(idCurso : number) : Promise<AssuntoListagem[]>;
}