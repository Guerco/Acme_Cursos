-- Usuários
INSERT INTO credenciais (id, email, senha) VALUES
    (1, 'aluno@email.com', '123'),
    (2, 'maria.aluno@cefet.com', '123'),
    (3, 'bob.aluno@cefet.com', '123'),
    (4, 'ana.aluno@cefet.com', '123'),
    (5, 'aluno2@email.com', '123');

-- Alunos
INSERT INTO aluno (id, id_credenciais, nome) VALUES
    (1, 1, 'Aluno'),
    (2, 2, 'Maria de Souza Alvez'),
    (3, 3, 'Bob Ernesto Pereira'),
    (4, 4, 'Ana Clara de Oliveira'),
    (5, 5, 'Aluno 2');
-- Professores
INSERT INTO professor (id, nome) VALUES
    (1, 'Rosa Maria da Silva'),
    (2, 'Cerginho da Pereira Nunes'),
    (3, 'Cleber Breno Souza'),
    (4, 'Amauricio');

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
(6, 5, 'Relevo'),
(7, 5, 'Bacias Hidrográficas'),
(8, 5, 'Regiões do Brasil'),
(9, 6, 'Introdução a Hardware');

-- Perguntas
INSERT INTO pergunta (id, id_assunto, descricao, caminho_img, tempo_seg, dificuldade) VALUES
(1, 3, 'Quanto é 1 + 1?', 'imagem-padrao.png', 60, 'dificil'),
(2, 3, 'Qual é o resultado de 5 + (-3)?', NULL, 60, 'medio'),
(3, 3, '10 + 10 é igual a:', NULL, 60, 'facil'),
(4, 4, 'Quanto é 2/3 + 1/6?', NULL, 60, 'medio');

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