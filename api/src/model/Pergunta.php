<?php

class Pergunta{

    /**
     * @param RespostaPergunta[] $respostas
     */
    public function __construct(
        private int $id = 0,
        private ?Assunto $assunto = null,
        private string $descricao = '',
        private ?string $caminhoImg = '',
        private int $tempoSeg = 60,
        private Dificuldade $dificuldade = Dificuldade::FACIL,
        private array $respostas = [],
        private ?DateTime $ultimaAtualizacao = null
    ){}

    public function getAssunto(): ?Assunto{
        return $this->assunto;
    }
    public function setAssunto(Assunto $assunto): void{
        $this->assunto = $assunto;
    }
    
    public function getId(): int{
        return $this->id;
    }
    public function setId(int $id): void{
        $this->id = $id;
    }

    public function getDescricao(): string{
        return $this->descricao;
    }
    public function setDescricao(string $descricao): void{
        $this->descricao = $descricao;
    }

    public function getCaminhoImg(): ?string{
        return $this->caminhoImg;
    }
    public function setCaminhoImg(string $caminhoImg): void{
        $this->caminhoImg = $caminhoImg;
    }

    public function getTempoSeg(): int{
        return $this->tempoSeg;
    }
    public function setTempoSeg(int $tempoSeg): void{
        $this->tempoSeg = $tempoSeg;
    }

    public function getDificuldade(): Dificuldade{
        return $this->dificuldade;
    }
    public function setDificuldade(Dificuldade $dificuldade): void{
        $this->dificuldade = $dificuldade;
    }

    /**
     * @return RespostaPergunta[]
     */
    public function getRespostas(): array{
        return $this->respostas;
    }

    /**
     * @param RespostaPergunta[] $respostas
     */
    public function setRespostas(array $respostas): void{
        $this->respostas = $respostas;
    }

    public function addResposta(RespostaPergunta $resposta): void{
        $this->respostas []= $resposta;
    }

    public function getUltimaAtualizacao(): ?DateTime {
    return $this->ultimaAtualizacao;
    }

    public function setUltimaAtualizacao(DateTime $ultimaAtualizacao): void {
        $this->ultimaAtualizacao = $ultimaAtualizacao;
    }

    public function validar() {
        $problemas = [];

        $tamanhoDescricao = strlen($this->descricao);
        $tempoSeg = $this->tempoSeg;
        $respostas = $this->respostas;

        if ($tamanhoDescricao < 10 || $tamanhoDescricao > 255)
            $problemas[] = 'A descrição deve ter de 10 a 255 caracteres.';

        if ($tempoSeg < 30 || $tempoSeg > 180)
            $problemas[] = 'O tempo em segundos deve ser de 30 a 180.';

        $respostasCorretas = 0;
        $qtdRespostas = 0;
        $saiu = false;

        foreach ($respostas as $r) {
            $qtdRespostas++;

            $tamanhoDescricao = strlen($r->getDescricao());
            if ($tamanhoDescricao < 1 || $tamanhoDescricao > 200) {
                $problemas[] = 'A descrição das respostas deve ter de 1 a 200 caracteres.';
                $saiu = true;
                break;
            }

            if ($r->isCorreta()) $respostasCorretas++;
        }

        if (!$saiu) {
            if ($qtdRespostas < 2 || $qtdRespostas > 5) {
                $problemas[] = 'A pergunta deve possuir de 2 a 5 respostas.';
            } else {
                if ($respostasCorretas == 0)
                    $problemas[] = 'A pergunta não pode não possuir nenhuma resposta correta.';
        
                if ($respostasCorretas >= $qtdRespostas)
                    $problemas[] = 'A pergunta não pode possuir todas respostas corretas.';
            }
        }

        if (!empty($problemas)) throw DominioException::comProblemas($problemas);
    }
}