<?php

class AlunoRelDTO{

    public function __construct(
        public int $posicao,
        public string $nome,
        public float $pontuacaoGeral,
    ){}
    
    public static function deVO(AlunoRelVO $vo): AlunoRelDTO {
        return new self(
            $vo->getPosicao(),
            $vo->getNome(),
            $vo->getPontuacaoGeral()
        );
    }

    /**
     * @param AlunoRelVO[] $vos
     * @return AlunoRelDTO[]
     */
    public static function deVOS(array $vos): array {
        $dtos = [];

        foreach ($vos as $vo) {
            $dtos[] = self::deVO($vo);
        }

        return $dtos;
    }
}