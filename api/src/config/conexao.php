<?php

const HOST = 'localhost';
const USUARIO = 'root';
const SENHA = '';

function criarConexao(): PDO{
    $nomeBanco = 'g2';
    $dsn = "mysql:dbname=" .$nomeBanco . ";host=" . HOST . ";charset=utf8";
    
    $pdo = new PDO(
        $dsn,
        USUARIO,
        SENHA,
        [ 
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC 
        ]
    );

  return $pdo;
}

