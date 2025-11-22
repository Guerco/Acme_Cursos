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

        $this->autentificacao = Double::instance([
            'implements' => Autentificacao::class
        ]);
        allow($this->autentificacao)->toReceive('estaLogado')->andReturn(true);
        
        $this->autorizacao = Double::instance([
            'implements' => Autorizacao::class
        ]);
        allow($this->autorizacao)->toReceive('verificarAutorizacao')->andReturn(true);

        $this->gestorAlunos              = new GestorAlunos(
            $this->repositorioTesteAlunos, 
            $this->repositorioTestePerguntas, 
            $this->repositorioTesteCursos,
            $this->gerenciadorTransacoes,
            $this->repositorioTesteAssuntos,
            $this->autentificacao,
            $this->autorizacao

        );
    });

    describe('buscarPontuacoes', function (): void {

        beforeEach(function(): void{
            allow($this->autentificacao)->toReceive('buscarTipoUsuario')->andReturn('aluno');
            allow($this->autentificacao)->toReceive('buscaridUsuario')->andReturn(1);
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
            allow($this->autentificacao)->toReceive('buscarTipoUsuario')->andReturn('aluno');
            allow($this->autentificacao)->toReceive('buscaridUsuario')->andReturn(1);
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
});