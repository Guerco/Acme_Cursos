<?php

use Kahlan\Plugin\Double;

function criarPerguntaTeste($id = 0, $descricao = ""): Pergunta{
    $pergunta = new Pergunta();
    $pergunta->setId($id);
    $pergunta->setDescricao($descricao);
    $pergunta->setCaminhoImg("imagem_$id.jpg");
    $pergunta->setTempoSeg(60);
    $pergunta->setDificuldade(Dificuldade::FACIL);

    $resposta = new RespostaPergunta();
    $resposta->setId(1);
    $resposta->setPergunta($pergunta); 
    $resposta->setDescricao("Resposta para: $descricao");
    $resposta->setCorreta(1);
    $pergunta->addResposta($resposta); 
 
    return $pergunta;
}

describe('GestorPerguntas', function(): void{

    beforeEach(function(): void{
        $this->repositorioTestePerguntas = Double::instance(['implements' => RepositorioPerguntas::class]);
        $this->repositorioTesteAlunos = Double::instance(['implements' => RepositorioAlunos::class]);
        $this->gestorPerguntas = new GestorPerguntas($this->repositorioTestePerguntas,$this->repositorioTesteAlunos);
    });

    describe('buscarPerguntasAluno', function():void{

        it('retorna um array de objetos de PerguntaListagemDTO', function():void{
            allow($this->repositorioTestePerguntas)->toReceive('buscarPorAssuntoEAluno')->andReturn([
                criarPerguntaTeste(1,'pergunta teste 1'),
                criarPerguntaTeste(2,'pergunta teste 2')
            ]);
            allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(true);

            $resultado = $this->gestorPerguntas->buscarPerguntasAluno(1, 1);
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0]?? null)->toBeAnInstanceOf(PerguntaListagemDTO::class);
        });
    });
      
});