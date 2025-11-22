-- Usuários
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
    (10, 'administrador1@cefet.com', '123');

-- Alunos
INSERT INTO aluno (id, id_credenciais, nome) VALUES
    (1, 1, 'Aluno'),
    (2, 2, 'Maria de Souza Alvez'),
    (3, 3, 'Bob Ernesto Pereira'),
    (4, 4, 'Ana Clara de Oliveira'),
    (5, 5, 'Aluno 2');
-- Professores
INSERT INTO professor (id, id_credenciais, nome) VALUES
    (1, 6,'Rosa Maria da Silva'),
    (2, 7,'Cerginho da Pereira Nunes'),
    (3, 8,'Cleber Breno Souza'),
    (4, 9,'Amauricio');

-- Cursos
INSERT INTO curso (id, id_professor, descricao, caminho_img) VALUES
(1, 1, 'Microsoft Excel Intermediário', '1.jpg'),
(2, 1, 'Matemática Básica', '2.jpg'),
(3, 2, 'Modelagem de dados', '3.jpg'),
(4, 2, 'Modelando dados no Power BI', '4.jpg'),
(5, 3, 'Geografia', 'imagem-padrao.png'),
(6, 4, 'Fundamentos de TI: Hardware e Software', '5.jpg');

-- Assuntos
INSERT INTO assunto (id, id_curso, descricao) VALUES
(1, 1, 'Gráficos'),
(2, 1, 'Automatização de Planilhas'),
(3, 2, 'Soma'),
(4, 2, 'Frações'),
(5, 3, 'Diagrama de Classes'),
(6, 5, 'Capitais'),
(7, 5, 'Bacias Hidrográficas'),
(8, 5, 'Regiões do Brasil'),
(9, 6, 'Introdução a Hardware');

-- Perguntas
INSERT INTO pergunta (id, id_assunto, descricao, caminho_img, tempo_seg, dificuldade, ultima_atualizacao) VALUES
(1, 3, 'Quanto é 1 + 1?', 'imagem-padrao.png', 60, 'dificil', NOW()),
(2, 3, 'Qual é o resultado de 5 + (-3)?', NULL, 40, 'medio', NOW()),
(3, 3, '10 + 10 é igual a:', NULL, 30, 'facil', NOW()),
(4, 4, 'Quanto é 2/3 + 1/6?', NULL, 30, 'medio', NOW());

-- Respostas das perguntas
INSERT INTO resposta_pergunta (id, id_pergunta, descricao, correta) VALUES
-- Questão 1
(1, 1, '1', false),
(2, 1, '2', true),
(3, 1, '3', false),
(4, 1, '4', false),
-- Questão 2
(5, 2, '8', false),
(6, 2, '-8', false),
(7, 2, '2', true),
(8, 2, '1000', false),
-- Questão 3
(9, 3, '1000 (mil)', false),
(10, 3, '1 (um)', false),
(11, 3, '20 (vinte)', true),
-- Questão 4
(12, 4, '3/9', false),
(13, 4, '5/6', true);

UPDATE 
    credenciais 
SET 
    senha = "3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2" 
where 1;

INSERT INTO resposta_aluno(id, id_aluno, id_pergunta, resposta_correta) VALUES (1, 5, 4, false);

-- Administrador
INSERT INTO administrador (id, id_credenciais, nome) VALUES
    (1, 10,'Roberto Rodrigues de Paula'),
    (2, 6, 'Rosa Maria da Silva');

-- Login
UPDATE 
    credenciais 
SET 
    senha = "76d67a0ded0f3cdfd978ef3a03ed4b1876c03f076bfe657b9430b55e4c56e6668e2405fd4da7b4254ce82b23f49d433de5b413f98f01cad7d2487ea57d8ee8cc" 
    , salSenha = "2eb08fa75b58fc31c28c8c063753b6ca"
where 1;

UPDATE credenciais
SET 
    email = "adm@email.com"
WHERE id = 10;

UPDATE administrador
SET
    nome = "Adm da Silva"
WHERE id = 1;

-- Pontuacao geral dos alunos
UPDATE aluno SET pontuacao_geral = 207 WHERE id = 1;
UPDATE aluno SET pontuacao_geral = 223 WHERE id = 2;
UPDATE aluno SET pontuacao_geral = 108 WHERE id = 3;
UPDATE aluno SET pontuacao_geral = 179 WHERE id = 4;
UPDATE aluno SET pontuacao_geral = 33 WHERE id = 5;

-- Tabela pontuacao
INSERT INTO pontuacao (id_aluno, id_curso, pontuacao) VALUES
(1, 1, 80), (2, 1, 18), (3, 1, 22), (4, 1, 45), (5, 1, 1),
(3, 2, 30), (4, 2, 45), (5, 2, 15), (1, 3, 7), (2, 3, 18), 
(3, 3, 22), (4, 3, 44), (5, 3, 10), (1, 4, 50), (2, 4, 99), 
(3, 4, 10), (1, 5, 55), (2, 5, 18), (3, 5, 24), (4, 5, 45), 
(5, 5, 7),(1, 6, 5), (2, 6, 70);

