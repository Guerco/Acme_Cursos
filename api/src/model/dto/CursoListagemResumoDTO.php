<?php

class CursoListagemResumoDTO{
    public function __construct(
        public ?int $id,
        public ?string $descricao
    ){}
   
    public static function deObjeto(Curso $curso): CursoListagemResumoDTO{
        return new Self(
            $curso->getId(),
            $curso->getDescricao()
        );
    }

    /**
     * @param Curso[] $cursos
     * @return CursoListagemDTO[]
     */
    public static function deObjetos(array $cursos): array{
        $cursosDTO = [];

        foreach($cursos as $curso){
            $cursosDTO[] = Self::deObjeto($curso);
        }

        return $cursosDTO;
    }
    
}