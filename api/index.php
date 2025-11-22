<?php
require_once 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

require_once './src/config/conexao.php';

use phputil\router\{Router, HttpRequest, HttpResponse};
use function phputil\cors\cors;

try {
    $pdo = criarConexao();
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['erros' => 'Erro ao conectar com o banco de dados.']);
    exit;
} catch (ServidorException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['erros' => 'Ocorreu um erro interno no servidor.']);
    exit;
}

$options = [
    'origin' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
    'credentials' => true,
    'allowedHeaders' => ['Content-Type', 'Authorization', 'Accept'],
    'methods' => ['GET', 'POST', 'DELETE'],
    'maxAge' => 3600
];

$app = new Router();
$app->use(cors( $options ));

// Rotas
// Rotas de Cursos
$app->route('/cursos')

    ->get('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorCursos = criarGestor('cursos');
    
            $filtro = $_GET['busca'] ?? '';
            $resultado = $gestorCursos->listarCursos($filtro);
            $res->status(200)->json($resultado);
        }, $res);

    })

    ->get('/:id/assuntos', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorCursos = criarGestor('cursos');
    
            $idCurso = $req->param('id') ?? '';
    
            $assuntos = $gestorCursos->buscarAssuntosCurso($idCurso);
    
            $res->status(200)->json($assuntos);
        }, $res);

    });

// Rotas de Alunos
$app->route('/alunos')

    ->get('/pontuacoes', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorAlunos = criarGestor('alunos');
    
            $idAssunto = $_GET['id_assunto'] ?? '';
            $pontuacao = $gestorAlunos->buscarPontuacoes($idAssunto);
            $res->status(200)->json($pontuacao);
        }, $res);

    })

    ->post('/respostas', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorAlunos = criarGestor('alunos');
    
            $body = (array) $req->body();
            $resultado = $gestorAlunos->salvarResposta($body);
            $res->status(200)->json(['respostaCorreta' => $resultado]);
        }, $res);

    });

// Rotas de assuntos
$app->route('/assuntos')

    ->get('/:id/perguntas', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorPerguntas = criarGestor('perguntas');
    
            $idAssunto = $req->param('id') ?? '';
    
            $perguntas = $gestorPerguntas->buscarPerguntasAluno($idAssunto);
    
            $res->status(200)->json($perguntas);
        }, $res);

    });

// Rotas de usuarios
$app->route('/usuarios')

    ->get('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorCredenciais = criarGestor('credenciais');
            $filtro = $_GET['busca'] ?? '';

            $resultado = $gestorCredenciais->listarUsuarios($filtro);
            $res->status(200)->json($resultado);
        }, $res);

    })

    ->post('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorCredenciais = criarGestor('credenciais');
    
            $body = (array) $req->body();
            $gestorCredenciais->criarUsuario(UsuarioCadastroDTO::deArray($body));
            $res->status(201)->json(['Sucesso']);
        }, $res);

    });

// Rotas de Professores
$app->route('/professores')

    ->get('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorProfessores = criarGestor('professores');
    
            $resultado = $gestorProfessores->listarProfessoresResumido();
            $res->status(200)->json($resultado);
        }, $res);

    })

    ->get('/:id/cursos', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorProfessores = criarGestor('professores');
    
            $idProfessor = $req->param('id') ?? '';
    
            $professores = $gestorProfessores->buscarCursosProfessor($idProfessor);
    
            $res->status(200)->json($professores);
        }, $res);

    });

// Rotas de Perguntas
$app->route('/perguntas')

    ->post('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorPerguntas = criarGestor('perguntas');
            $gestorPerguntas->criarPergunta(json_decode(json_encode($req->body()), true));
            $res->status(204)->end();
        }, $res);

    })

    ->get('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorPerguntas = criarGestor('perguntas');
    
            $idAssunto = $_GET['id_assunto'] ?? null;
            $resultado = $gestorPerguntas->listarPerguntasOuPorAssunto($idAssunto);
            if ($resultado == []) {
                if ( $idAssunto ) $res->status(200)->json(['mensagem'=> 'Este assunto não possui perguntas.']);
                else $res->status(200)->json(['mensagem'=> 'Não há perguntas para se listar.']);
            } else
                $res->status(200)->json($resultado);
        }, $res);

    });

// Rotas de Perguntas
$app->route('/login')

    ->post('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        
        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorLogin = criarGestor('login');
            $usuario = $gestorLogin->entrar((array) $req->body());
            $res->status(200)->json($usuario);
        }, $res);

    })

    ->delete('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorLogin = criarGestor('login');
            $gestorLogin->sair();
            $res->status(204)->end();
        }, $res);

    });

// Rotas de Relatórios
$app->route('/relatorios')

    ->get('/rankingPorPontuacaoGeral', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorAlunos = criarGestor('alunos');
    
            $filtro = $_GET['busca'] ?? '';
            $resultado = $gestorAlunos->listarRankingPorPontuacaoGeral($filtro);
    
            $res->status(200)->json($resultado);
        }, $res);
    })

    ->get('/rankingAlunosPorCurso', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorAlunos = criarGestor('alunos');
    
            $filtro = $_GET['busca'] ?? '';
            $resultado = $gestorAlunos->listarRankingAlunosPorCurso($filtro);
            $res->status(200)->json($resultado);
        }, $res);
    })

    ->get('/numeroDeAlunosPorCurso', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorCursos = criarGestor('cursos');
    
            $resultado = $gestorCursos->listarNumeroDeAlunosPorCurso();
            $res->status(200)->json($resultado);
        }, $res);
    });  

$app->listen();

/**
 * Instancia um gestor de determinado tipo e seus repositórios.
 * 
 * @param 'cursos'|'alunos'|'perguntas'|'credenciais'|'professores'|'login' $tipoGestor
 * @return void
 */
function criarGestor(string $tipoGestor): GestorCursos|GestorAlunos|GestorCredenciais|GestorPerguntas|GestorProfessores|GestorLogin|null {
    global $pdo;

    switch (strtolower($tipoGestor)) {

        case 'cursos':
            return new GestorCursos(
                new RepositorioCursosEmBDR($pdo),
                new RepositorioAssuntosEmBDR($pdo),
                new AutorizacaoEmArquivo(),
                new AutentificacaoEmArquivo(
                    new GerenciadorDeSenhaEnv(),
                    new RepositorioCredenciaisEmBDR($pdo)
                )
            );

        case 'alunos':
            return new GestorAlunos(
                new RepositorioAlunosEmBDR($pdo),
                new RepositorioPerguntasEmBDR($pdo),
                new RepositorioCursosEmBDR($pdo),
                new GerenciadorDeTransacoesEmBDR($pdo),
                new RepositorioAssuntosEmBDR($pdo),
                new AutentificacaoEmArquivo(
                    new GerenciadorDeSenhaEnv(),
                    new RepositorioCredenciaisEmBDR($pdo)
                ),
                new AutorizacaoEmArquivo()
            );

        case 'perguntas':
            return new GestorPerguntas(
                new RepositorioPerguntasEmBDR($pdo),
                new RepositorioAlunosEmBDR($pdo),
                new RepositorioAssuntosEmBDR($pdo),
                new RepositorioRespostasPerguntaEmBDR($pdo),
                new GerenciadorDeTransacoesEmBDR($pdo),
                new AutentificacaoEmArquivo(
                    new GerenciadorDeSenhaEnv(),
                    new RepositorioCredenciaisEmBDR($pdo)
                ),
                new AutorizacaoEmArquivo()
            );

        case 'credenciais':
            $repoCredenciais = new RepositorioCredenciaisEmBDR($pdo);
            $senhaEnv = new GerenciadorDeSenhaEnv();
            return new GestorCredenciais(
                $repoCredenciais,
                new RepositorioAlunosEmBDR($pdo),
                new RepositorioProfessoresEmBDR($pdo),
                new RepositorioAdministradoresEmBDR($pdo),
                new GerenciadorDeTransacoesEmBDR($pdo),
                $senhaEnv,
                new AutentificacaoEmArquivo(
                    $senhaEnv,
                    $repoCredenciais
                ),
                new AutorizacaoEmArquivo()
            );

        case 'professores':
            return new GestorProfessores(
                new RepositorioProfessoresEmBDR($pdo),
                new RepositorioCursosEmBDR($pdo),
                new AutentificacaoEmArquivo(
                    new GerenciadorDeSenhaEnv(),
                    new RepositorioCredenciaisEmBDR($pdo)
                ),
                new AutorizacaoEmArquivo()
            );

        case 'login':
            $repoCredenciais = new RepositorioCredenciaisEmBDR($pdo);

            return new GestorLogin(
                new AutentificacaoEmArquivo(
                    new GerenciadorDeSenhaEnv(),
                    $repoCredenciais
                ),
                $repoCredenciais
            );

        default:
            return null;
    }
}


function executaComTratamentoErros (callable $callback, HttpResponse $res) {
    try {
        $callback();
    } catch (NaoAutorizadoException $e) {
        $res->status(401)->json(['erros' => $e->getMessage()]);
    } catch (NaoEncontradoException $e) {
        $res->status(404)->json(['erros' => $e->getProblemas()]);
    } catch (DominioException $e) {
        $res->status(400)->json(['erros' => $e->getProblemas()]);
    } catch (RepositorioException $e) {
        $res->status(500)->json(['erros' => $e->getMessage()]);
    } catch (ServidorException $e) {
        $res->status(500)->json(['erros' => $e->getMessage()]);
    } catch (RuntimeException $e) {
        $res->status(500)->json(['erros' => $e->getMessage()]);
    } catch (Throwable $e) {
        error_log($e->getMessage());
        $res->status(500)->json(['erros' => 'Ocorreu um erro interno no servidor.']);
    }
}