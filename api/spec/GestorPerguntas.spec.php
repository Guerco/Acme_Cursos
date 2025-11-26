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

function criarPerguntaListagemTeste($descricaoAssunto = "", $descricaoPergunta = ""): Pergunta{
    $professor = new Professor(1, 'Professor teste');
    $curso = new Curso($professor,1,'Curso teste');
    $assunto = new Assunto($curso,1,$descricaoAssunto);

    $pergunta = new Pergunta();
    $pergunta->setAssunto($assunto);
    $pergunta->setDescricao($descricaoPergunta);
    $pergunta->setCaminhoImg('Teste caminho_img'. $descricaoPergunta);
    $pergunta->setTempoSeg(60);
    $pergunta->setDificuldade(Dificuldade::FACIL);
    $pergunta->setUltimaAtualizacao(new DateTime());

    $resposta = new RespostaPergunta(); 
    $resposta->setDescricao("Resposta para: $descricaoPergunta");
    $resposta->setCorreta(1);
    $pergunta->addResposta($resposta); 
    return $pergunta;
}

describe('GestorPerguntas', function(): void{

    beforeEach(function(): void{
        $this->repositorioTestePerguntas = Double::instance(['implements' => RepositorioPerguntas::class]);
        allow($this->repositorioTestePerguntas)->toReceive('existePerguntaAssunto')->andReturn(false);

        $this->repositorioTesteAlunos = Double::instance(['implements' => RepositorioAlunos::class]);
        $this->repositorioAssuntos = Double::instance(['implements' => RepositorioAssuntos::class]);
        $this->repositorioRespostas = Double::instance(['implements' => RepositorioRespostasPergunta::class]);

        $this->gerenciadorTransacoes = Double::instance([
            'implements' => GerenciadorDeTransacoes::class
        ]);
        allow($this->gerenciadorTransacoes)->toReceive('iniciar');
        allow($this->gerenciadorTransacoes)->toReceive('confirmar');
        allow($this->gerenciadorTransacoes)->toReceive('reverter');

        $this->autentificacao = Double::instance([
            'implements' => Autentificacao::class
        ]);
        allow($this->autentificacao)->toReceive('estaLogado')->andReturn(true);
        
        $this->autorizacao = Double::instance([
            'implements' => Autorizacao::class
        ]);
        allow($this->autorizacao)->toReceive('verificarAutorizacao')->andReturn(true);

        $this->gestorPerguntas = new GestorPerguntas(
            $this->repositorioTestePerguntas,
            $this->repositorioTesteAlunos,
            $this->repositorioAssuntos,
            $this->repositorioRespostas,
            $this->gerenciadorTransacoes,
            $this->autentificacao,
            $this->autorizacao,
        );
    });

    describe('buscarPerguntasAluno', function():void{

        beforeEach(function(): void{
            allow($this->autentificacao)->toReceive('buscarTipoUsuario')->andReturn('aluno');
            allow($this->autentificacao)->toReceive('buscaridUsuario')->andReturn(1);
        });

        it('retorna um array de objetos de PerguntaListagemQuizDTO', function():void{
            allow($this->repositorioTestePerguntas)->toReceive('buscarPorAssuntoEAluno')->andReturn([
                criarPerguntaTeste(1,'pergunta teste 1'),
                criarPerguntaTeste(2,'pergunta teste 2')
            ]);
            allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(true);
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            $resultado = $this->gestorPerguntas->buscarPerguntasAluno(1);
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0]?? null)->toBeAnInstanceOf(PerguntaListagemQuizDTO::class);
        });

        it('lança uma exceção ao não informar id de assunto', function():void{
            
            $idAssunto = '';

            expect(function () use ($idAssunto): void {
                $this->gestorPerguntas->buscarPerguntasAluno($idAssunto);
            })->toThrow(new DominioException());
        });

        it('lança uma exceção ao informar id de assunto não inteiro', function():void{
            
            $idAssunto = 'id_nao_numerico';

            expect(function () use ($idAssunto): void {
                $this->gestorPerguntas->buscarPerguntasAluno($idAssunto);
            })->toThrow(new DominioException('Os ids devem ser inteiros.'));
        });
        
        it('lança uma exceção ao informar id de um assunto inexistente', function():void{
            allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(true);
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(false);
            
            $idAssunto = -1;

            expect(function () use ($idAssunto): void {
                $this->gestorPerguntas->buscarPerguntasAluno($idAssunto);
            })->toThrow(new NaoEncontradoException());
        });
    });

   describe('listarPerguntasOuPorAssunto', function():void{


        it('retorna um array de objetos de PerguntaListagemDTO', function():void{
            allow($this->repositorioTestePerguntas)->toReceive('listarTodosOuPorAssunto')->andReturn([
                criarPerguntaListagemTeste('2','pergunta teste 1'),
                criarPerguntaListagemTeste('1','pergunta teste 2')
            ]);
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            allow($this->autentificacao)->toReceive('buscarTipoUsuario')->andReturn('administrador');

            $resultado = $this->gestorPerguntas->listarPerguntasOuPorAssunto(1);
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0]?? null)->toBeAnInstanceOf(PerguntaListagemDTO::class);

        });

    });

    describe('criarPergunta', function():void{

        beforeEach(function(): void{
            allow($this->autentificacao)->toReceive('buscarTipoUsuario')->andReturn('administrador');
        });

        it('envia a pergunta quando passamos os dados corretamente', function():void{
            
            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 60,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ]
            ];

            allow($this->repositorioTestePerguntas)->toReceive('cadastrarPergunta')->andReturn(1);
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->not->toThrow();

         });

         it('lança uma exceção ao informar uma descrição com menos de 10 caracteres ou mais de 255', function():void{
            
            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 60,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ]
            ];
         
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException('A descrição deve ter de 10 a 255 caracteres.'));

         });

         it('lança uma exceção ao informar o tempo em segundos com menos de 30 segundos ou mais de 180', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 29,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ]
            ];
         
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException('O tempo em segundos deve ser de 30 a 180.'));

         });

         it('lança uma exceção ao informar uma descrição da resposta com menos de 1 caracter ou mais de 200', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 30,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => ''],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ]
            ];
         
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException('A descrição das respostas deve ter de 1 a 200 caracteres.'));

         });

         it('lança uma exceção ao informar 1 resposta para a pergunta ou mais de 5', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 30,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste']
                ]
            ];
         
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException('A pergunta deve possuir de 2 a 5 respostas.'));

         });
         
         it('lança uma exceção ao informar uma pergunta com nenhuma resposta correta', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 30,
                'respostas'   => [
                    ['ehCorreta' => false,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ]
            ];
         
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException('A pergunta não pode não possuir nenhuma resposta correta.'));

         });

         it('lança uma exceção ao informar uma pergunta com todas as respostas corretas', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 30,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => true, 'descricao' => 'descricao resposta teste2']
                ]
            ];
         
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException('A pergunta não pode possuir todas respostas corretas.'));

         });
         
         it('lança uma exceção ao informar uma pergunta com uma dificuldade inexistente', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'teste',
                'tempoSeg'    => 30,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ]
            ];
         
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(true);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException("O campo 'dificuldade' deve ser ['facil', 'medio', 'dificil']."));

         });
         
         it('lança uma exceção ao informar um base 64 da imagem inválido', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 30,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ],
                'figuraBase64' => 'teste figura base 64'
            ];

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException("Figura inválida."));

         });
         
         it('lança uma exceção ao informar uma imagem com formato inválido', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 30,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ],
                'figuraBase64' => 'AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAA
            AAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////
            AP///wD///8A////AP///wD///8A////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            '
            ];

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException("A imagem deve estar nos formatos PNG ou JPEG."));

         });

         it('lança uma exceção ao informar um assunto inexistente', function():void{

            $dados = [
                'idAssunto'   => 1,
                'descricao'   => 'teste descricao', 
                'dificuldade' => 'dificil',
                'tempoSeg'    => 30,
                'respostas'   => [
                    ['ehCorreta' => true,  'descricao' => 'descricao resposta teste'],
                    ['ehCorreta' => false, 'descricao' => 'descricao resposta teste2']
                ]
            ];
         
            allow($this->repositorioAssuntos)->toReceive('existeComId')->andReturn(false);

            expect(function () use ($dados) {
                $this->gestorPerguntas->criarPergunta($dados);
            })->toThrow(new DominioException("Assunto inexistente."));

         });
    });


});