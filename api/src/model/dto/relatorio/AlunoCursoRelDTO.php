<?php

class AlunoCursoRelDTO{

    public function __construct(
        public string $descricao, 
        public int $posicao,
        public string $nomeAluno,
        public float $pontuacao,
    ){}
    
    public static function deVO(AlunoCursoRelVO $vo): AlunoCursoRelDTO {
        return new self(
            $vo->getDescricao(),
            $vo->getPosicao(),
            $vo->getNomeAluno(),
            $vo->getPontuacao()
        );
    }

    /**
     * @param AlunoCursoRelVO[] $vos
     * @return AlunoCursoRelDTO[]
     */
    public static function deVOS(array $vos): array {
        $dtos = [];

        foreach ($vos as $vo) {
            $dtos[] = self::deVO($vo);
        }

        return $dtos;
    }
}