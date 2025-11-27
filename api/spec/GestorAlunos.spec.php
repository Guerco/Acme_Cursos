<?php

use Kahlan\Plugin\Double;

function criarAlunoTeste($id = 0, $nome = ""): aluno
{
    $aluno = new aluno();
    $aluno->setId($id);
    $aluno->setNome($nome);
    $aluno->setPontuacaoGeral(0.0);

    return $aluno;
}

function criarListagemTeste($posicao = 0, $nome = "", $pontuacao = 0): AlunoRelVO {
    return new AlunoRelVO(
            $posicao,
            $nome,
            $pontuacao
            );

}

function criarListagemTesteAlunoCurso($descricao = "", $posicao = 0, $nome = "", $pontuacao = 0): AlunoCursoRelVO{
    return new AlunoCursoRelVO(
            $descricao,
            $posicao,
            $nome,
            $pontuacao
            );

}

describe('GestorAlunos', function (): void {

    beforeEach(function (): void {
        $this->repositorioTesteAlunos    = Double::instance(['implements' => RepositorioAlunos::class]);
        $this->repositorioTestePerguntas = Double::instance(['implements' => RepositorioPerguntas::class]);
        $this->repositorioTesteCursos    = Double::instance(['implements' => RepositorioCursos::class]);
        $this->repositorioTesteAssuntos    = Double::instance(['implements' => RepositorioAssuntos::class]);

        $this->gerenciadorTransacoes = Double::instance([
            'implements' => GerenciadorDeTransacoes::class,
        ]);
        allow($this->gerenciadorTransacoes)->toReceive('iniciar');
        allow($this->gerenciadorTransacoes)->toReceive('confirmar');
        allow($this->gerenciadorTransacoes)->toReceive('reverter');

        allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(true);
        allow($this->repositorioTesteAlunos)->toReceive('buscarPontuacaoGeral')->andReturn(100.0);
        allow($this->repositorioTesteAlunos)->toReceive('buscarPontuacaoPorCurso')->andReturn(
            new PontuacaoCurso(
                new Curso(
                    null, 1
                ),
                new Aluno(
                    1
                ),
                100.00,
                1
            )
        );

        allow($this->repositorioTesteAssuntos)->toReceive('existeComId')->andReturn(true);
        allow($this->repositorioTesteAssuntos)->toReceive('buscarPeloId')->andReturn(New Assunto(
            New Curso(null),
            1,
            'assunto'
        ));

        $this->autenticacao = Double::instance([
            'implements' => Autenticacao::class
        ]);
        allow($this->autenticacao)->toReceive('estaLogado')->andReturn(true);
        
        $this->autorizacao = Double::instance([
            'implements' => Autorizacao::class
        ]);
        allow($this->autorizacao)->toReceive('verificarAutorizacao')->andReturn(true);

        $this->gestorAlunos              = new GestorAlunos(
            $this->repositorioTesteAlunos, 
            $this->repositorioTestePerguntas, 
            $this->gerenciadorTransacoes,
            $this->repositorioTesteAssuntos,
            $this->autenticacao,
            $this->autorizacao

        );
    });

    describe('buscarPontuacoes', function (): void {

        beforeEach(function(): void{
            allow($this->autenticacao)->toReceive('buscarTipoUsuario')->andReturn('aluno');
            allow($this->autenticacao)->toReceive('buscaridUsuario')->andReturn(1);
        });

        it('retorna uma pontuação', function (): void {
            allow($this->repositorioTesteAlunos)->toReceive('buscarPontuacoes')->andReturn(new PontuacoesAlunoDTO(
                'Assunto',
                10.0,
                10.0
            ));
            allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(true);
            allow($this->repositorioTesteCursos)->toReceive('existeComId')->andReturn(true);

            $idAssunto = 1;

            $pontuacao = $this->gestorAlunos->buscarPontuacoes($idAssunto);

            expect($pontuacao)->toBeAnInstanceOf(PontuacoesAlunoDTO::class);
        });

        it('lança uma exceção ao não informar id de assunto', function (): void {
            $idAssunto = '';

            expect(function () use ($idAssunto): void {
                $this->gestorAlunos->buscarPontuacoes($idAssunto);
            })->toThrow(new DominioException());
        });

        it('lança uma exceção ao informar id de assunto não inteiros', function (): void {
            $idAssunto = 'nao_inteiro';

            expect(function () use ($idAssunto): void {
                $this->gestorAlunos->buscarPontuacoes($idAssunto);
            })->toThrow(new DominioException());
        });

        it('lança uma exceção ao informar id de um assunto inexistente', function (): void {
            allow($this->repositorioTesteAssuntos)->toReceive('existeComId')->andReturn(false);

            $idAssunto = -1;

            expect(function () use ($idAssunto): void {
                $this->gestorAlunos->buscarPontuacoes($idAssunto);
            })->toThrow(new DominioException());
        });
    });

    describe('salvarResposta', function (): void {
        beforeEach(function(): void{
            allow($this->autenticacao)->toReceive('buscarTipoUsuario')->andReturn('aluno');
            allow($this->autenticacao)->toReceive('buscaridUsuario')->andReturn(1);
        });
        
        it('retorna true se as respostas forem corretas', function (): void {
            allow($this->repositorioTesteAlunos)->toReceive('existeComCredenciais')->andReturn(
                criarAlunoTeste(1, 'aluno teste 1')
            );

            allow($this->repositorioTesteAlunos)->toReceive('existeResposta')->andReturn(false);
            allow($this->repositorioTesteAlunos)->toReceive('cadastrarResposta');
            allow($this->repositorioTesteAlunos)->toReceive('incrementarPontuacaoGeral');
            allow($this->repositorioTesteAlunos)->toReceive('incrementarPontuacaoCurso');
            allow($this->repositorioTestePerguntas)->toReceive('existeComId')->andReturn(true);
            allow($this->repositorioTestePerguntas)->toReceive('buscarIdsRespostasCorretas')->andReturn([0,1,2,3]);
            allow($this->repositorioTestePerguntas)->toReceive('buscarCursoEDificuldadePeloID')->andReturn(['idCurso'=>1, 'dificuldade'=>'facil']);
            $respostaAluno = [
                'idPergunta' => 1, 
                'idsRespostas' => [0, 1, 2, 3]
            ];

            $acertou = $this->gestorAlunos->salvarResposta($respostaAluno);

            expect($acertou)->toBe(true);
        });

        it('retorna false se as respostas forem incorretas', function (): void {
            allow($this->repositorioTesteAlunos)->toReceive('existeComCredenciais')->andReturn(
                criarAlunoTeste(1, 'aluno teste 1')
            );

            allow($this->repositorioTesteAlunos)->toReceive('existeResposta')->andReturn(false);
            allow($this->repositorioTesteAlunos)->toReceive('cadastrarResposta');
            allow($this->repositorioTesteAlunos)->toReceive('incrementarPontuacaoGeral');
            allow($this->repositorioTesteAlunos)->toReceive('incrementarPontuacaoCurso');
            allow($this->repositorioTestePerguntas)->toReceive('existeComId')->andReturn(true);
            allow($this->repositorioTestePerguntas)->toReceive('buscarIdsRespostasCorretas')->andReturn([0,1,2]);
            allow($this->repositorioTestePerguntas)->toReceive('buscarCursoEDificuldadePeloID')->andReturn(['idCurso'=>1, 'dificuldade'=>'facil']);
            $respostaAluno = [
                'idPergunta' => 1, 
                'idsRespostas' => [0, 1, 2, 3]
            ];

            $acertou = $this->gestorAlunos->salvarResposta($respostaAluno);

            expect($acertou)->toBe(false);
        });
    });

    
    describe('listarRankingPorPontuacaoGeral', function():void{

        it('retorna um array de value object de AlunoRelDTO', function():void{
            allow($this->repositorioTesteAlunos)->toReceive('rankingPorPontuacaoGeral')->andReturn([
                criarListagemTeste(1,'Aluno teste 1', 78),
                criarListagemTeste(2,'Aluno teste 2', 55)
            ]);


            $resultado = $this->gestorAlunos->listarRankingPorPontuacaoGeral("");
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0]?? null)->toBeAnInstanceOf(AlunoRelDTO::class);
        });
    });

    describe('listarRankingAlunosPorCurso', function():void{

        it('retorna um array de value object de AlunoCursoRelDTO', function():void{
            allow($this->repositorioTesteAlunos)->toReceive('rankingAlunosPorCurso')->andReturn([
                criarListagemTesteAlunoCurso('Curso teste 1',1,'Aluno teste 1', 78),
                criarListagemTesteAlunoCurso('CUrso teste 2',2,'Aluno teste 2', 55)
            ]);

            $resultado = $this->gestorAlunos->listarRankingAlunosPorCurso("");
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0]?? null)->toBeAnInstanceOf(AlunoCursoRelDTO::class);
        });
    });

});