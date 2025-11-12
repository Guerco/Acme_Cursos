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
        $this->repositorioAssuntos = Double::instance(['implements' => RepositorioAssuntos::class]);
        $this->repositorioRespostas = Double::instance(['implements' => RepositorioRespostasPergunta::class]);

        $this->gestorPerguntas = new GestorPerguntas(
            $this->repositorioTestePerguntas,
            $this->repositorioTesteAlunos,
            $this->repositorioAssuntos,
            $this->repositorioRespostas
        );
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

        it('lança uma exceção ao não informar id de assunto e aluno', function():void{
            
            $idAssunto = '';
            $idAluno = '';

            expect(function () use ($idAssunto, $idAluno): void {
                $this->gestorPerguntas->buscarPerguntasAluno($idAssunto, $idAluno);
            })->toThrow(new DominioException('Informe assunto e aluno.'));
        });

        it('lança uma exceção ao informar id de assunto e aluno não inteiro', function():void{
            
            $idAssunto = 'id_nao_numerico';
            $idAluno = 'id_nao_numerico';

            expect(function () use ($idAssunto, $idAluno): void {
                $this->gestorPerguntas->buscarPerguntasAluno($idAssunto, $idAluno);
            })->toThrow(new DominioException('Os ids devem ser inteiros.'));
        });
        
        it('lança uma exceção ao informar id de um aluno inexistente', function():void{
            allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(false);
            
            $idAssunto = 1;
            $idAluno = -1;

            expect(function () use ($idAssunto, $idAluno): void {
                $this->gestorPerguntas->buscarPerguntasAluno($idAssunto, $idAluno);
            })->toThrow(new NaoEncontradoException('Aluno inexistente.'));
        });
    });
});