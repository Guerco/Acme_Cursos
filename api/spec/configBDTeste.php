<?php

    const HOST = 'localhost';
    const USUARIO = 'root';
    const SENHA = '';

    function criarConexao(): PDO{
        
        $pdo = new PDO(
            "mysql:host=" . HOST . ";charset=utf8",
            USUARIO,
            SENHA,
            [ 
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC 
            ]
        );
        return $pdo;

    }

    function criarConexaoBanco(): PDO{
        $nomeBanco = 'g2teste';
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

    function criarBDTestes(PDO $pdo){
        $sql = <<<'SQL'
            CREATE DATABASE IF NOT EXISTS g2teste
                CHARACTER SET utf8mb4
                COLLATE utf8mb4_general_ci;
        SQL;

        $ps = $pdo->prepare($sql);
        $ps->execute();
    }

    function criarEstruturaBDTestes(PDO $pdo){
         $sql = <<<'SQL'
            USE g2teste;

            CREATE TABLE IF NOT EXISTS credenciais(
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                senha VARCHAR(100) NOT NULL
            ) ENGINE=INNODB;

            CREATE TABLE IF NOT EXISTS aluno(
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_credenciais INT,
                nome VARCHAR(100) NOT NULL,
                pontuacao_geral FLOAT DEFAULT 0,
                FOREIGN KEY (id_credenciais) REFERENCES credenciais(id)
            ) ENGINE=INNODB;

            CREATE TABLE IF NOT EXISTS professor(
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL
            ) ENGINE=INNODB;

            CREATE TABLE IF NOT EXISTS curso(
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_professor INT NOT NULL,
                descricao VARCHAR(255) NOT NULL,
                caminho_img VARCHAR(255) NOT NULL,
                FOREIGN KEY (id_professor) REFERENCES professor(id)
            ) ENGINE=INNODB;

            CREATE TABLE IF NOT EXISTS assunto(
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_curso INT NOT NULL,
                descricao VARCHAR(100) NOT NULL,
                FOREIGN KEY (id_curso) REFERENCES curso(id)
            ) ENGINE=INNODB;

            CREATE TABLE IF NOT EXISTS pontuacao(
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_aluno INT NOT NULL,
                id_curso INT NOT NULL,
                pontuacao FLOAT DEFAULT 0,
                FOREIGN KEY (id_aluno) REFERENCES aluno(id),
                FOREIGN KEY (id_curso) REFERENCES curso(id)
            ) ENGINE=INNODB;

            CREATE TABLE IF NOT EXISTS pergunta(
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_assunto INT NOT NULL,
                descricao VARCHAR(255) NOT NULL,
                caminho_img VARCHAR(255),
                tempo_seg INT DEFAULT 60,
                dificuldade ENUM ('facil', 'medio', 'dificil')  NOT NULL,
                FOREIGN KEY (id_assunto) REFERENCES assunto(id)
            ) ENGINE=INNODB;

            CREATE TABLE IF NOT EXISTS resposta_pergunta(
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_pergunta INT NOT NULL,
                descricao VARCHAR(200) NOT NULL,
                correta BOOLEAN NOT NULL,
                FOREIGN KEY (id_pergunta) REFERENCES pergunta(id)
            ) ENGINE=INNODB;

            CREATE TABLE IF NOT EXISTS resposta_aluno(
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_aluno INT NOT NULL,
                id_pergunta INT NOT NULL,
                resposta_correta BOOLEAN NOT NULL,
                FOREIGN KEY (id_aluno) REFERENCES aluno(id),
                FOREIGN KEY (id_pergunta) REFERENCES pergunta(id)
            ) ENGINE=INNODB;

            ALTER TABLE pontuacao
            ADD UNIQUE KEY unica_aluno_curso (id_aluno, id_curso);

            ALTER TABLE resposta_aluno
            ADD UNIQUE KEY unica_aluno_curso (id_aluno, id_pergunta);

            ALTER TABLE credenciais 
            ADD COLUMN salSenha VARCHAR(100);

            ALTER TABLE professor
            ADD COLUMN id_credenciais INT
            AFTER id;

            ALTER TABLE professor 
            ADD FOREIGN KEY (id_credenciais) 
            REFERENCES credenciais(id);

            CREATE TABLE IF NOT EXISTS administrador(
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_credenciais INT,
            nome VARCHAR(100) NOT NULL,
            FOREIGN KEY (id_credenciais) REFERENCES credenciais(id)
            ) ENGINE=INNODB;

            ALTER TABLE pergunta
            ADD column ultimaAtualizacao DATETIME;
        SQL;

        $ps = $pdo->prepare($sql);
        $ps->execute();
    }

    function inserirDadosBDTestes(PDO $pdo){
           $sql = <<<'SQL'
            USE g2teste;

            INSERT INTO credenciais (id, email, senha) VALUES
                (1, 'aluno@email.com', '123'),
                (2, 'maria.aluno@cefet.com', '123'),
                (3, 'bob.aluno@cefet.com', '123'),
                (4, 'ana.aluno@cefet.com', '123'),
                (5, 'aluno2@email.com', '123'),
                (6, 'professor1@email.com', '123'),
                (7, 'professor2@cefet.com', '123'),
                (8, 'professor3@cefet.com', '123'),
                (9, 'professor4@cefet.com', '123'),
                (10, 'administrador1@cefet.com', '123'),
                (11, 'bonnie.aluno@email.com', '123'),
                (12, 'joao.aluno@cefet.com', '123'),
                (13, 'jose.aluno@cefet.com', '123'),
                (14, 'carlos.aluno@cefet.com', '123'),
                (15, 'tobbie.aluno@cefet.com', '123');

            INSERT INTO aluno (id, id_credenciais, nome) VALUES
                (1, 1, 'Aluno'),
                (2, 2, 'Maria de Souza Alvez'),
                (3, 3, 'Bob Ernesto Pereira'),
                (4, 4, 'Ana Clara de Oliveira'),
                (5, 5, 'Aluno 2'),
                (6, 11, 'Bonnie Almeida'),
                (7, 12, 'João de Lima'),
                (8, 13, 'José Soares'),
                (9, 14, 'Carlos Costa'),
                (10, 15, 'Tobbie Rocha');

            INSERT INTO professor (id, id_credenciais, nome) VALUES
                (1, 6,'Rosa Maria da Silva'),
                (2, 7,'Cerginho da Pereira Nunes'),
                (3, 8,'Cleber Breno Souza'),
                (4, 9,'Amaurício');

            INSERT INTO curso (id, id_professor, descricao, caminho_img) VALUES
                (1, 1, 'Microsoft Excel Intermediário', '1.jpg'),
                (2, 1, 'Matemática Básica', '2.jpg'),
                (3, 2, 'Modelagem de dados', '3.jpg'),
                (4, 2, 'Modelando dados no Power BI', '4.jpg'),
                (5, 3, 'Geografia', 'imagem-padrao.png'),
                (6, 4, 'Fundamentos de TI: Hardaware e Software', '5.jpg');

            INSERT INTO assunto (id, id_curso, descricao) VALUES
                (1, 1, 'Gráficos'),
                (2, 1, 'Automatização de Planilhas'),
                (3, 2, 'Soma'),
                (4, 2, 'Frações'),
                (5, 3, 'Diagrama de Classes'),
                (6, 5, 'Relevo'),
                (7, 5, 'Bacias Hidrográficas'),
                (8, 5, 'Regiões do Brasil'),
                (9, 6, 'Introdução a Hardware');

            INSERT INTO pergunta (id, id_assunto, descricao, caminho_img, tempo_seg, dificuldade) VALUES
                (1, 3, 'Quanto é 1 + 1?', 'imagem-padrao.png', 60, 'dificil'),
                (2, 3, 'Qual é o resultado de 5 + (-3)?', NULL, 60, 'medio'),
                (3, 3, '10 + 10 é igual a:', NULL, 60, 'facil'),
                (4, 4, 'Quanto é 2/3 + 1/6?', NULL, 60, 'medio');

            INSERT INTO resposta_pergunta (id, id_pergunta, descricao, correta) VALUES
                (1, 1, '1', false),
                (2, 1, '2', true),
                (3, 1, '3', false),
                (4, 1, '4', false),
                (5, 2, '8', false),
                (6, 2, '-8', false),
                (7, 2, '2', true),
                (8, 2, '1000', false),
                (9, 3, '1000 (mil)', false),
                (10, 3, '1 (um)', false),
                (11, 3, '20 (vinte)', true),
                (12, 4, '3/9', false),
                (13, 4, '5/6', true);

            INSERT INTO resposta_aluno (id, id_aluno, id_pergunta, resposta_correta) VALUES
                (1, 1, 1, 1),
                (2, 2, 1, 0),
                (3, 3, 2, 1);

            INSERT INTO pontuacao (id, id_aluno, id_curso, pontuacao) values
                (1,1,1,10),
                (2,2,1,0),
                (3,3,2,5);

            INSERT INTO administrador (id, id_credenciais, nome) VALUES
                (1, 10,'Roberto Rodrigues de Paula');
            
            UPDATE aluno SET pontuacao_geral = 207 WHERE id = 1;
            UPDATE aluno SET pontuacao_geral = 223 WHERE id = 2;
            UPDATE aluno SET pontuacao_geral = 108 WHERE id = 3;
            UPDATE aluno SET pontuacao_geral = 179 WHERE id = 4;
            UPDATE aluno SET pontuacao_geral = 33 WHERE id = 5;
            UPDATE aluno SET pontuacao_geral = 119 WHERE id = 6;
            UPDATE aluno SET pontuacao_geral = 104 WHERE id = 7;
            UPDATE aluno SET pontuacao_geral = 112 WHERE id = 8;
            UPDATE aluno SET pontuacao_geral = 59 WHERE id = 9;
            UPDATE aluno SET pontuacao_geral = 59 WHERE id = 10;

            INSERT INTO pontuacao (id_aluno, id_curso, pontuacao) VALUES
            (3, 1, 22), (4, 1, 45), (5, 1, 1),(4, 2, 45), (5, 2, 15), 
            (1, 3, 7), (2, 3, 18), (3, 3, 22), (4, 3, 44), (5, 3, 10), 
            (1, 4, 50), (2, 4, 99), (3, 4, 10), (1, 5, 55), (2, 5, 18), 
            (3, 5, 24), (4, 5, 45), (5, 5, 7),  (1, 6, 5), (2, 6, 70), 
            (6, 1, 22), (7, 1, 37), (8, 1, 48), (9, 1, 22), (6, 2, 11),
            (10, 2, 16), (7, 2, 45), (9, 2, 15), (8, 3, 7), (10, 3, 18), 
            (6, 3, 21), (7, 3, 7), (10, 4, 13), (8, 4, 47), (6, 5, 30), 
            (7, 5, 15), (9, 5, 22), (10, 5, 12), (6, 6, 35), (8, 6, 10);
        SQL;

        $ps = $pdo->prepare($sql);
        $ps->execute();
    }

    function excluirBDTestes(PDO $pdo){
        $sql = <<<'SQL'
           DROP DATABASE IF EXISTS g2teste;
        SQL;

        $ps = $pdo->prepare($sql);
        $ps->execute();
    }

    function prepararBDTestes(): PDO{
        $pdo = criarConexao();
        criarBDTestes($pdo);
            
        $pdo = criarConexaoBanco();
        criarEstruturaBDTestes($pdo);
        inserirDadosBDTestes($pdo);

        return $pdo;
    }