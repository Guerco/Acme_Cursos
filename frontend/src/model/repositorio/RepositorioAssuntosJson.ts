import { AssuntoListagem } from "../dto/AssuntoListagem";

export class RepositorioAssuntosJson {
    async buscarPorIdCurso(idCurso: number): Promise<AssuntoListagem[]> {
        const assuntos = [
            { "id": 1, "idCurso": 1, "descricao": "Gráficos" },
            { "id": 2, "idCurso": 1, "descricao": "Automatização de Planilhas" },
            { "id": 3, "idCurso": 2, "descricao": "Soma" },
            { "id": 4, "idCurso": 2, "descricao": "Frações" },
            { "id": 5, "idCurso": 3, "descricao": "Diagrama de Classes" },
            { "id": 6, "idCurso": 5, "descricao": "Relevo" },
            { "id": 7, "idCurso": 5, "descricao": "Bacias Hidrográficas" },
            { "id": 8, "idCurso": 5, "descricao": "Regiões do Brasil" },
            { "id": 9, "idCurso": 6, "descricao": "Introdução a Hardware" }
        ];

        return assuntos
            .filter(a => a.idCurso === idCurso)
            .map(a => ({
                id: a.id,
                descricao: a.descricao
            }));
    }
}
