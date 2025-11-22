<?php

class CursoQtdAlunoRelDTO{

    public function __construct(
        public string $descricao,
        public int $quantidade,
    ){}
    
    public static function deVO(CursoQtdAlunoRelVO $vo): CursoQtdAlunoRelDTO {
        return new self(
            $vo->getDescricao(),
            $vo->getQuantidade()
        );
    }

    /**
     * @param CursoQtdAlunoRelVO[] $vos
     * @return CursoQtdAlunoRelDTO[]
     */
    public static function deVOS(array $vos): array {
        $dtos = [];

        foreach ($vos as $vo) {
            $dtos[] = self::deVO($vo);
        }

        return $dtos;
    }

}