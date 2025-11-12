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

describe('GestorCursos', function(): void{

    beforeEach(function(): void{
        $this->repositorioCursos = Double::instance(['implements' => RepositorioCursos::class]);
        $this->repositorioAssuntos = Double::instance(['implements' => RepositorioAssuntos::class]);

        $this->gestorCursos = new GestorCursos( 
            $this->repositorioCursos,
            $this->repositorioAssuntos
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
      
});