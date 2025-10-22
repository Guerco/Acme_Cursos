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
        $this->gestorAlunos              = new GestorAlunos($this->repositorioTesteAlunos, $this->repositorioTestePerguntas, $this->repositorioTesteCursos);
    });

    describe('verificarCredenciais', function (): void {

        it('retorna um array de objetos de AlunoListagemDTO', function (): void {
            allow($this->repositorioTesteAlunos)->toReceive('existeComCredenciais')->andReturn(
                criarAlunoTeste(1, 'aluno teste 1')
            );

            $dados['email'] = 'aluno@email.com';
            $dados['senha'] = '123';
            $resultado      = $this->gestorAlunos->verificarCredenciais($dados);
            expect($resultado)->toBeAn('object');
            expect($resultado)->not->toBe(0);
            expect($resultado ?? null)->toBeAnInstanceOf(AlunoListagemDTO::class);
        });

        it('lança uma exceção ao informar um email inválido', function (): void {
            $credenciaisInválidas = ['email' => 'email_invalido', 'senha' => 'senha'];

            expect(function () use ($credenciaisInválidas): void {
                $this->gestorAlunos->verificarCredenciais($credenciaisInválidas);
            })->toThrow(new DominioException());
        });

        it('lança uma exceção ao informar email e senha vazios', function (): void {
            $credenciaisInválidas = ['email' => '', 'senha' => ''];

            expect(function () use ($credenciaisInválidas): void {
                $this->gestorAlunos->verificarCredenciais($credenciaisInválidas);
            })->toThrow(new DominioException());
        });
    });

    describe('buscarPontuacaoCurso', function (): void {
        it('retorna uma pontuação', function (): void {
            allow($this->repositorioTesteAlunos)->toReceive('buscarPontuacaoPorCurso')->andReturn(10.5);
            allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(true);
            allow($this->repositorioTesteCursos)->toReceive('existeComId')->andReturn(true);

            $idAluno = 1;
            $idCurso = 1;

            $pontuacao = $this->gestorAlunos->buscarPontuacaoCurso($idAluno, $idCurso);

            expect($pontuacao)->toBeA('float');
        });

        it('lança uma exceção ao não informar id de aluno e curso', function (): void {
            $idAluno = '';
            $idCurso = '';

            expect(function () use ($idAluno, $idCurso): void {
                $this->gestorAlunos->buscarPontuacaoCurso($idAluno, $idCurso);
            })->toThrow(new DominioException());
        });

        it('lança uma exceção ao informar id de aluno e curso não inteiros', function (): void {
            $idAluno = 'nao_inteiro';
            $idCurso = 'nao_inteiro';

            expect(function () use ($idAluno, $idCurso): void {
                $this->gestorAlunos->buscarPontuacaoCurso($idAluno, $idCurso);
            })->toThrow(new DominioException());
        });

        it('lança uma exceção ao informar id de um aluno inexistente', function (): void {
            allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(false);
            allow($this->repositorioTesteCursos)->toReceive('existeComId')->andReturn(true);

            $idAluno = -1;
            $idCurso = 1;

            expect(function () use ($idAluno, $idCurso): void {
                $this->gestorAlunos->buscarPontuacaoCurso($idAluno, $idCurso);
            })->toThrow(new NaoEncontradoException('Aluno inexistente.'));
        });

        it('lança uma exceção ao informar id de um aluno inexistente', function (): void {
            allow($this->repositorioTesteAlunos)->toReceive('existeComId')->andReturn(true);
            allow($this->repositorioTesteCursos)->toReceive('existeComId')->andReturn(false);

            $idAluno = 1;
            $idCurso = -1;

            expect(function () use ($idAluno, $idCurso): void {
                $this->gestorAlunos->buscarPontuacaoCurso($idAluno, $idCurso);
            })->toThrow(new NaoEncontradoException('Curso inexistente.'));
        });
    });

    describe('salvarResposta', function (): void {
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
            $respostaAluno = RespostaAlunoCadastroDTO::deArray(
                [
                    'credenciaisAluno' => ['email' => 'aluno@email.com', 'senha' => 'senha'], 
                    'idPergunta' => 1, 
                    'idsRespostas' => [0, 1, 2, 3]
                ]
            );

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
            $respostaAluno = RespostaAlunoCadastroDTO::deArray(
                [
                    'credenciaisAluno' => ['email' => 'aluno@email.com', 'senha' => 'senha'], 
                    'idPergunta' => 1, 
                    'idsRespostas' => [0, 1, 2, 3]
                ]
            );

            $acertou = $this->gestorAlunos->salvarResposta($respostaAluno);

            expect($acertou)->toBe(false);
        });
    });
});