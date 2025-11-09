<?php
require_once 'vendor/autoload.php';
require_once './src/config/conexao.php';

use phputil\router\{Router, HttpRequest, HttpResponse};
use function phputil\cors\cors;

try {
    $pdo = criarConexao();
    GerenciadorDeTransacao::definirConexao($pdo);
} catch (PDOException $e) {
    http_response_code(500);
    die('Erro ao conectar com o banco de dados.');
}

$app = new Router();
$app->use( cors() );

// Repositórios
$repositorioAlunos = new RepositorioAlunosEmBDR($pdo);
$repositorioPerguntas = new RepositorioPerguntasEmBDR($pdo);
$repositorioCursos = new RepositorioCursosEmBDR($pdo);
$repositorioCredenciais = new RepositorioCredenciaisEmBDR($pdo);
$repositorioProfessor = new RepositorioProfessoresEmBDR($pdo);
$repositorioAdministrador = new RepositorioAdministradoresEmBDR($pdo);

// Servicos
$gestorCursos = new GestorCursos(
    $repositorioCursos
);
$gestorAlunos = new GestorAlunos(
    $repositorioAlunos,
    $repositorioPerguntas,
    $repositorioCursos
);
$gestorPerguntas = new GestorPerguntas(
    $repositorioPerguntas,
    $repositorioAlunos
);
$gestorCredenciais = new GestorCredenciais(
    $repositorioCredenciais,
    $repositorioAlunos,
    $repositorioProfessor,
    $repositorioAdministrador
);

// Rotas
// Rotas de Cursos
$app->route('/cursos')

    ->get( '/', function( HttpRequest $req, HttpResponse $res ) use ( $gestorCursos ) {
        try {
            $filtro = $_GET['busca'] ?? '';
            $resultado = $gestorCursos->listarCursos($filtro);
            $res->status( 200 )->json( $resultado );
        } catch ( RepositorioException $e ) {
            $res->status( 500 )->json( $e->getMessage());
        }
} );

// Rotas de Alunos
$app->route('/alunos')

    ->post( '/verificarCredenciais', function( HttpRequest $req, HttpResponse $res ) use ( $gestorAlunos ) {
        try {
            $aluno = $gestorAlunos->verificarCredenciais((array) $req->body());
            $res->status( 200 )->json($aluno);
        } catch ( NaoEncontradoException $e ) {
            $res->status( 404 )->json( $e->getMessage());
        } catch ( DominioException $e ) {
            $res->status( 400 )->json( ['erros' => $e->getProblemas()]);
        } catch ( RepositorioException $e ) {
            $res->status( 500 )->json( $e->getMessage());
        }
    } )

    ->get( '/:id/pontuacaoCurso', function(HttpRequest $req, HttpResponse $res) use ( $gestorAlunos ) { 
        try {
            $idAluno = $req->param('id') ?? null;
            $idCurso = $_GET['id_curso'] ?? '';
            $pontuacao = $gestorAlunos->buscarPontuacaoCurso($idAluno, $idCurso);
            $res->status( 200 )->json(['pontuacao' => $pontuacao]);
        } catch ( NaoEncontradoException $e ) {
            $res->status( 404 )->json( ['erros' => $e->getProblemas()]);
        } catch ( DominioException $e ) {
            $res->status( 400 )->json( ['erros' => $e->getProblemas()]);
        } catch ( RepositorioException $e ) {
            $res->status( 500 )->json( $e->getMessage());
        }
    } );

// Rotas de assuntos
$app->route('/assuntos')
    ->get( '/:id/perguntas', function(HttpRequest $req, HttpResponse $res) use ( $gestorPerguntas ) { 
        try {
            $idAssunto = $req->param('id') ?? '';
            $idAluno = $_GET['id_aluno'] ?? '';

            $perguntas = $gestorPerguntas->buscarPerguntasAluno($idAssunto, $idAluno);
            
            $res->status( 200 )->json( $perguntas );
        } catch ( NaoEncontradoException $e ) {
            $res->status( 404 )->json( $e->getProblemas());
        } catch ( DominioException $e ) {
            $res->status( 400 )->json( $e->getProblemas());
        } catch ( RepositorioException $e ) {
            $res->status( 500 )->json( $e->getMessage());
        }
    } );
    
// Rotas de RespostasAluno
$app->route('/respostasAluno')
    ->post('/', function(HttpRequest $req, HttpResponse $res) use ($gestorAlunos){
        
        try {
            $body = (array) $req->body();
            $resultado = $gestorAlunos->salvarResposta(RespostaAlunoCadastroDTO::deArray($body));
            $res->status(200)->json(['respostaCorreta' => $resultado]);
        } catch ( NaoEncontradoException $e ) {
            $res->status( 404 )->json( ['erros' => $e->getProblemas()]);
        } catch ( DominioException $e ) {
            $res->status( 400 )->json( ['erros' => $e->getProblemas()]);
        } catch ( RepositorioException $e ) {
            $res->status( 500 )->json( $e->getMessage());
        }
    });

// Rotas de usuarios
$app->route('/usuarios')

    ->get( '/', function( HttpRequest $req, HttpResponse $res ) use ( $gestorCredenciais ) {

        try {
            $resultado = $gestorCredenciais->listarUsuarios();
            $res->status( 200 )->json( $resultado );
        } catch ( RepositorioException $e ) {
            $res->status( 500 )->json( $e->getMessage());
        }
    })

    ->post('/', function(HttpRequest $req, HttpResponse $res) use ($gestorCredenciais){
        
        try {
            $body = (array) $req->body();
            $resultado = $gestorCredenciais->criarUsuario(UsuarioCadastroDTO::deArray($body));
            $res->status(201)->json(['Sucesso']);
        } catch ( NaoEncontradoException $e ) {
            $res->status( 404 )->json( ['erros' => $e->getProblemas()]);
        } catch ( DominioException $e ) {
            $res->status( 400 )->json( ['erros' => $e->getProblemas()]);
        } catch ( RepositorioException $e ) {
            $res->status( 500 )->json( $e->getMessage());
        }
    });


$app->listen(); 
