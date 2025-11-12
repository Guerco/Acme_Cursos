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
        try {
            $gestorCursos = criarGestor('cursos');

            $filtro = $_GET['busca'] ?? '';
            $resultado = $gestorCursos->listarCursos($filtro);
            $res->status(200)->json($resultado);
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    })

    ->get('/:id/assuntos', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorCursos = criarGestor('cursos');

            $idCurso = $req->param('id') ?? '';

            $assuntos = $gestorCursos->buscarAssuntosCurso($idCurso);

            $res->status(200)->json($assuntos);
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (RepositorioException $e) {
            $res->status(500)->json(['erros' => $e->getProblemas()]);
        }
    });

// Rotas de Alunos
$app->route('/alunos')

    ->post('/verificarCredenciais', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorAlunos = criarGestor('alunos');

            $aluno = $gestorAlunos->verificarCredenciais((array) $req->body());
            $res->status(200)->json($aluno);
        } catch (NaoEncontradoException $e) {
            $res->status(404)->json($e->getMessage());
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    })

    ->get('/:id/pontuacaoCurso', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorAlunos = criarGestor('alunos');

            $idAluno = $req->param('id') ?? null;
            $idCurso = $_GET['id_curso'] ?? '';
            $pontuacao = $gestorAlunos->buscarPontuacaoCurso($idAluno, $idCurso);
            $res->status(200)->json(['pontuacao' => $pontuacao]);
        } catch (NaoEncontradoException $e) {
            $res->status(404)->json(['erros' => $e->getProblemas()]);
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    });

// Rotas de assuntos
$app->route('/assuntos')

    ->get('/:id/perguntas', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorPerguntas = criarGestor('perguntas');

            $idAssunto = $req->param('id') ?? '';
            $idAluno = $_GET['id_aluno'] ?? '';

            $perguntas = $gestorPerguntas->buscarPerguntasAluno($idAssunto, $idAluno);

            $res->status(200)->json($perguntas);
        } catch (NaoEncontradoException $e) {
            $res->status(404)->json($e->getProblemas());
        } catch (DominioException $e) {
            $res->status(400)->json($e->getProblemas());
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    });

// Rotas de RespostasAluno
$app->route('/respostasAluno')

    ->post('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorAlunos = criarGestor('alunos');

            $body = (array) $req->body();
            $resultado = $gestorAlunos->salvarResposta(RespostaAlunoCadastroDTO::deArray($body));
            $res->status(200)->json(['respostaCorreta' => $resultado]);
        } catch (NaoEncontradoException $e) {
            $res->status(404)->json(['erros' => $e->getProblemas()]);
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    });

// Rotas de usuarios
$app->route('/usuarios')

    ->get('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorCredenciais = criarGestor('credenciais');
            $resultado = $gestorCredenciais->listarUsuarios();
            $res->status(200)->json($resultado);
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    })

    ->post('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorCredenciais = criarGestor('credenciais');

            $body = (array) $req->body();
            $gestorCredenciais->criarUsuario(UsuarioCadastroDTO::deArray($body));
            $res->status(201)->json(['Sucesso']);
        } catch (NaoEncontradoException $e) {
            $res->status(404)->json(['erros' => $e->getProblemas()]);
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    });

// Rotas de Professores
$app->route('/professores')

    ->get('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorProfessores = criarGestor('professores');

            $resultado = $gestorProfessores->listarProfessoresResumido();
            $res->status(200)->json($resultado);
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    })

    ->get('/:id/cursos', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorProfessores = criarGestor('professores');

            $idProfessor = $req->param('id') ?? '';

            $professores = $gestorProfessores->buscarCursosProfessor($idProfessor);

            $res->status(200)->json($professores);
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (RepositorioException $e) {
            $res->status(500)->json($e->getMessage());
        }
    });

// Rotas de Perguntas
$app->route('/perguntas')

    ->post('/', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        try {
            $gestorPerguntas = criarGestor('perguntas');
            $pergunta = PerguntaCadastroDTO::deArray(json_decode(json_encode($req->body()), true));
            $gestorPerguntas->criarPergunta($pergunta);
            $res->status(204)->end();
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (Throwable $e) {
            $res->status(500)->json(['erros' => $e->getMessage()]);
        }
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
