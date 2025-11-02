DROP DATABASE IF EXISTS g2;

CREATE DATABASE IF NOT EXISTS g2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;


USE g2;

CREATE TABLE IF NOT EXISTS credenciais(
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(200) NOT NULL
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