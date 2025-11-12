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
$app->use(cors());

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

    ->post('/verificarCredenciais', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorAlunos = criarGestor('alunos');
    
            $aluno = $gestorAlunos->verificarCredenciais((array) $req->body());
            $res->status(200)->json($aluno);
        }, $res);

    })

    ->get('/:id/pontuacaoCurso', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorAlunos = criarGestor('alunos');
    
            $idAluno = $req->param('id') ?? null;
            $idCurso = $_GET['id_curso'] ?? '';
            $pontuacao = $gestorAlunos->buscarPontuacaoCurso($idAluno, $idCurso);
            $res->status(200)->json(['pontuacao' => $pontuacao]);
        }, $res);

    });

// Rotas de assuntos
$app->route('/assuntos')

    ->get('/:id/perguntas', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorPerguntas = criarGestor('perguntas');
    
            $idAssunto = $req->param('id') ?? '';
            $idAluno = $_GET['id_aluno'] ?? '';
    
            $perguntas = $gestorPerguntas->buscarPerguntasAluno($idAssunto, $idAluno);
    
            $res->status(200)->json($perguntas);
        }, $res);

    });

// Rotas de RespostasAluno
$app->route('/respostasAluno')

    ->post('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorAlunos = criarGestor('alunos');
    
            $body = (array) $req->body();
            $resultado = $gestorAlunos->salvarResposta(RespostaAlunoCadastroDTO::deArray($body));
            $res->status(200)->json(['respostaCorreta' => $resultado]);
        }, $res);

    });

// Rotas de usuarios
$app->route('/usuarios')

    ->get('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {

        executaComTratamentoErros(function () use ($pdo, $req, $res) {
            $gestorCredenciais = criarGestor('credenciais');
            $resultado = $gestorCredenciais->listarUsuarios();
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
            $pergunta = PerguntaCadastroDTO::deArray(json_decode(json_encode($req->body()), true));
            $gestorPerguntas->criarPergunta($pergunta);
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

$app->listen();

/**
 * Instancia um gestor de determinado tipo e seus repositórios.
 * 
 * @param 'cursos'|'alunos'|'perguntas'|'credenciais'|'professores' $tipoGestor
 * @return void
 */
function criarGestor(string $tipoGestor): GestorCursos|GestorAlunos|GestorCredenciais|GestorPerguntas|GestorProfessores|null
{
    global $pdo;

    return match (strtolower($tipoGestor)) {
        'cursos' => new GestorCursos(
            new RepositorioCursosEmBDR($pdo),
            new RepositorioAssuntosEmBDR($pdo)
        ),
        'alunos' => new GestorAlunos(
            new RepositorioAlunosEmBDR($pdo),
            new RepositorioPerguntasEmBDR($pdo),
            new RepositorioCursosEmBDR($pdo)
        ),
        'perguntas' => new GestorPerguntas(
            new RepositorioPerguntasEmBDR($pdo),
            new RepositorioAlunosEmBDR($pdo),
            new RepositorioAssuntosEmBDR($pdo),
            new RepositorioRespostasPerguntaEmBDR($pdo)
        ),
        'credenciais' => new GestorCredenciais(
            new RepositorioCredenciaisEmBDR($pdo),
            new RepositorioAlunosEmBDR($pdo),
            new RepositorioProfessoresEmBDR($pdo),
            new RepositorioAdministradoresEmBDR($pdo)
        ),
        'professores' => new GestorProfessores(
            new RepositorioProfessoresEmBDR($pdo),
            new RepositorioCursosEmBDR($pdo)
        ),
        default => null,
    };
}

function executaComTratamentoErros (callable $callback, HttpResponse $res) {
    try {
        $callback();
    } catch (NaoEncontradoException $e) {
        $res->status(404)->json(['erros' => $e->getProblemas()]);
    } catch (DominioException $e) {
        $res->status(400)->json(['erros' => $e->getProblemas()]);
    } catch (RepositorioException $e) {
        $res->status(500)->json(['erros' => $e->getMessage()]);
    } catch (Throwable $e) {
        $res->status(500)->json(['erros' => 'Ocorreu um erro interno no servidor.']);
    }
}