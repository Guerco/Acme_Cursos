<?php

class CursoListagemDTO{

    /**
     * @param null|AssuntoListagemDTO[] $assuntos
     */
    public function __construct(
        public ?int $id,
        public ?string $descricao,
        public ?string $caminhoImg,
        public ?string $nomeProfessor,  
        public ?array $assuntos
    ){}
   
    public static function deObjetoParaDTO(Curso $curso): CursoListagemDTO{
        return new Self(
            $curso->getId(),
            $curso->getDescricao(),
            $curso->getCaminhoImg(),
            $curso->getProfessor()->getNome(),
            AssuntoListagemDTO::deObjetos($curso->getAssuntos())
        );
    }

    /**
     * @param Curso[] $cursos
     * @return CursoListagemDTO[]
     */
    public static function deObjetosParaDTO(array $cursos): array{
        $cursosDTO = [];

        foreach($cursos as $curso){
            $cursosDTO[] = Self::deObjetoParaDTO($curso);
        }

        return $cursosDTO;
    }
    
}