<?php
require_once 'vendor/autoload.php';
require_once './src/config/conexao.php';

use phputil\router\{Router, HttpRequest, HttpResponse};
use function phputil\cors\cors;

try {
    $pdo = criarConexao();
} catch (PDOException $e) {
    http_response_code(500);
    die('Erro ao conectar com o banco de dados.');
}

$app = new Router();
$app->use( cors() );

$gestorCursos = new GestorCursos(
    new RepositorioCursosEmBDR($pdo)
);

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

$app->listen(); 
