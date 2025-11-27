<?php

use Kahlan\Plugin\Double;

function criarCursoTeste($id = 0, $descricao = "", $nomeProfessor = ""): Curso{
    $professor = new Professor();
    $professor->setId($id);
    $professor->setNome($nomeProfessor);

    $curso = new Curso($professor);
    $curso->setId($id);
    $curso->setDescricao($descricao);
    $curso->setCaminhoImg("imagem_$id.jpg");
    $curso->setProfessor($professor);

    $assunto = new Assunto($curso);
    $assunto->setId($id);
    $assunto->setDescricao("Assunto $id");
    $curso->addAssunto($assunto);
    
    return $curso;
}

function criarListagem($descricao = "", $quantidade = 0): CursoQtdAlunoRelVO {
    return new CursoQtdAlunoRelVO(
                $descricao,
                $quantidade
            );

}

describe('GestorCursos', function(): void{

    beforeEach(function(): void{
        $this->repositorioCursos = Double::instance(['implements' => RepositorioCursos::class]);
        $this->repositorioAssuntos = Double::instance(['implements' => RepositorioAssuntos::class]);

        $this->autenticacao = Double::instance([
            'implements' => Autenticacao::class
        ]);
        allow($this->autenticacao)->toReceive('estaLogado')->andReturn(true);
        
        $this->autorizacao = Double::instance([
            'implements' => Autorizacao::class
        ]);
        allow($this->autorizacao)->toReceive('verificarAutorizacao')->andReturn(true);

        $this->gestorCursos = new GestorCursos( 
            $this->repositorioCursos,
            $this->repositorioAssuntos,
            $this->autorizacao,
            $this->autenticacao
        );
    });

    describe('listarCursos', function():void{

        it('retorna um array de objetos de CursoListagemDTO', function():void{
            allow($this->repositorioCursos)->toReceive('listarCursos')->andReturn([
                criarCursoTeste(1,'Curso teste 1', 'Professor 1'),
                criarCursoTeste(2,'Curso teste 2', 'Professor 2')
            ]);

            $resultado = $this->gestorCursos->listarCursos("");
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0]?? null)->toBeAnInstanceOf(CursoListagemDTO::class);
        });
    });

    describe('listarNumeroDeAlunosPorCurso', function():void{

        it('retorna um array de value object de CursoQtdAlunoRelDTO', function():void{
            allow($this->repositorioCursos)->toReceive('numeroDeAlunosPorCurso')->andReturn([
                criarListagem('Curso teste 1', 50),
                criarListagem('CUrso teste 2', 42)
            ]);

            $resultado = $this->gestorCursos->listarNumeroDeAlunosPorCurso();
            expect($resultado)->toBeAn('array');
            expect(count($resultado))->not->toBe(0);
            expect($resultado[0]?? null)->toBeAnInstanceOf(CursoQtdAlunoRelDTO::class);
        });
    });
      
});