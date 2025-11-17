<?php

function criarConexao(): PDO{
    $host = $_ENV['BD_HOST'] ?? null;
    $usuario = $_ENV['BD_USUARIO'] ?? null;
    $senha = $_ENV['BD_SENHA'] ?? null;

    if ($host === null) {
        throw new ServidorException('Variável de ambiente BD_HOST não configurada');
    }
    if ($usuario === null) {
        throw new ServidorException('Variável de ambiente BD_USUARIO não configurada');
    }
    if ($senha === null) {
        throw new ServidorException('Variável de ambiente BD_SENHA não configurada');
    }
    $nomeBanco = 'g2';
    $dsn = "mysql:dbname=" .$nomeBanco . ";host=" . $host . ";charset=utf8";
    
    $pdo = new PDO(
        $dsn,
        $usuario,
        $senha,
        [ 
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC 
        ]
    );

  return $pdo;
}

