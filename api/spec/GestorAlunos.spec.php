<?php

use Kahlan\Plugin\Double;

function criarAlunoTeste($id = 0, $nome = ""): aluno{
    $aluno = new aluno();
    $aluno->setId($id);
    $aluno->setNome($nome); 
    $aluno->setPontuacaoGeral(0.0);
 
    return $aluno;
}

describe('GestorAlunos', function(): void{

    beforeEach(function(): void{
        $this->repositorioTesteAlunos = Double::instance(['implements' => RepositorioAlunos::class]);
        $this->repositorioTestePerguntas = Double::instance(['implements' => RepositorioPerguntas::class]);
        $this->repositorioTesteCursos = Double::instance(['implements' => RepositorioCursos::class]);
        $this->gestorAlunos = new GestorAlunos($this->repositorioTesteAlunos,$this->repositorioTestePerguntas, $this->repositorioTesteCursos);
    });

    describe('verificarCredenciais', function():void{

        it('retorna um array de objetos de AlunoListagemDTO', function():void{
            allow($this->repositorioTesteAlunos)->toReceive('existeComCredenciais')->andReturn(
                criarAlunoTeste(1,'aluno teste 1')
            );
        
            $dados ['email'] = 'aluno@email.com';
            $dados ['senha'] = '123';
            $resultado = $this->gestorAlunos->verificarCredenciais($dados);
            expect($resultado)->toBeAn('object');
            expect($resultado)->not->toBe(0);
            expect($resultado ?? null)->toBeAnInstanceOf(AlunoListagemDTO::class);
        });
    });
      
});