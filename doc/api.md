# Documentação da API 🧩

Neste documento estão listados todos os endpoints e funcionalidades da `API`.

---

## /cursos/ 🏫

### GET - /cursos/?busca=

**Descrição:** Lista todos os cursos ou filtra pelo nome do professor ou descrição do curso.
**Autorização:** Qualquer usuário (logado ou não)

**Parâmetros:**

| Nome  | Tipo   | Obrigatório | Descrição                                                               |
| ----- | ------ | ----------- | ----------------------------------------------------------------------- |
| busca | string | Não         | Palavra-chave para filtrar cursos ou nome do professor (URL codificada) |

**Formato de Resposta:**

```json
[
  {
		"id": 6,
		"descricao": "Fundamentos de TI: Hardware e Software",
		"caminhoImg": "5.jpg",
		"nomeProfessor": "Amauricio",
		"assuntos": [
			{
				"id": 9,
				"descricao": "Introdução a Hardware"
			}
		]
	}
]
```

---

### GET - /cursos/:id/assuntos

**Descrição:** Lista todos os assuntos de um curso específico.
**Autorização:** Professores e Administradores

**Parâmetros:**

| Nome | Tipo | Obrigatório | Descrição   |
| ---- | ---- | ----------- | ----------- |
| id   | int  | Sim         | ID do curso |

**Formato de Resposta:**

```json
[
  {
		"id": 9,
		"descricao": "Introdução a Hardware"
	}
]
```

---

## /alunos/ 🧑‍🎓

### GET - /alunos/pontuacoes?id_assunto=

**Descrição:** Busca a pontuação geral do aluno logado e sua pontuação em um assunto específico.
**Autorização:** Aluno

**Parâmetros:**

| Nome       | Tipo | Obrigatório | Descrição                 |
| ---------- | ---- | ----------- | ------------------------- |
| id_assunto | int  | Sim         | ID do assunto a consultar |

**Formato de Resposta:**

```json
{
  "descricaoAssunto": "Álgebra",
  "pontuacaoGeral": 85.5,
  "pontuacaoCurso": 50
}
```

---

### POST - /alunos/respostas

**Descrição:** Cadastra a resposta de uma pergunta do aluno logado e retorna se está correta, atualizando pontuações.
**Autorização:** Aluno

**Conteúdo da requisição:**

| Campo        | Tipo  | Obrigatório | Descrição                      |
| ------------ | ----- | ----------- | ------------------------------ |
| idPergunta   | int   | Sim         | ID da pergunta                 |
| idsRespostas | int[] | Sim         | IDs das respostas selecionadas |

```json
{
  "idPergunta": 10,
  "idsRespostas": [1, 3]
}
```

**Formato de Resposta:**

```json
{
  "respostaCorreta": true
}
```

---

### GET - /alunos/quizAleatorio

**Descrição:** Retorna o ID de um assunto aleatório que possua perguntas para o aluno responder ou false caso não hajam.
**Autorização:** Aluno

**Formato de Resposta:**

```json
{
  "idAssunto": 3
}
```

---

## /assuntos/ 📚

### GET - /assuntos/:id/perguntas

**Descrição:** Lista perguntas de um determinado assunto ainda não respondidas pelo aluno logado.
**Autorização:** Aluno

**Parâmetros:**

| Nome | Tipo | Obrigatório | Descrição     |
| ---- | ---- | ----------- | ------------- |
| id   | int  | Sim         | ID do assunto |

**Formato de Resposta:**

```json
[
  {
    "id": 1,
    "descricao": "Qual é 2+2?",
    "caminhoImg": null,
    "tempoSeg": 30,
    "dificuldade": "facil",
    "respostas": [
      {"id": 1, "descricao": "3"},
      {"id": 2, "descricao": "4"}
    ]
  }
]
```

---

## /usuarios/ 👥

### GET - /usuarios/?busaca=

**Descrição:** Lista todos os usuários ou filtra pelo nome através do parâmetro opcional `?busca`.
**Autorização:** Professores e Administradores

**Parâmetros:**

| Nome  | Tipo   | Obrigatório | Descrição                                  |
| ----- | ------ | ----------- | ------------------------------------------ |
| busca | string | Não         | Filtra usuários pelo nome (URL codificada) |

**Formato de Resposta:**

```json
[
  {
    "tipoUsuario": "aluno",
    "nome": "João Silva",
    "email": "joao@example.com"
  }
]
```

---

### POST - /usuarios/

**Descrição:** Cadastra um novo usuário.
**Autorização:** Administradores

**Conteúdo da requisição:**

| Campo       | Tipo   | Obrigatório | Descrição                                                          |
| ----------- | ------ | ----------- | ------------------------------------------------------------------ |
| nome        | string | Sim         | Nome do usuário                                                    |
| email       | string | Sim         | E-mail do usuário                                                  |
| senha       | string | Sim         | Senha do usuário                                                   |
| tipoUsuario | string | Sim         | 'aluno', 'professor', 'administrador' ou 'professor-administrador' |

```json
{
  "nome": "Maria Souza",
  "email": "maria@example.com",
  "senha": "senha123",
  "tipoUsuario": "professor"
}
```

**Formato de Resposta:**

```json
{
  "mensagem": "Usuário cadastrado com sucesso."
}
```

---

## /professores/ 👨‍🏫

### GET - /professores/

**Descrição:** Lista todos os professores cadastrados.
**Autorização:** Administradores

**Formato de Resposta:**

```json
[
  {
    "id": 1,
    "nome": "Professor X"
  }
]
```

---

### GET - /professores/:id/cursos

**Descrição:** Lista todos os cursos de um professor específico ou do professor logado.
**Autorização:** Professores e Administradores

**Parâmetros:**

| Nome | Tipo | Obrigatório | Descrição       |
| ---- | ---- | ----------- | --------------- |
| id   | int  | Sim         | ID do professor |

**Formato de Resposta:**

```json
[
  {
    "id": 1,
    "descricao": "Curso de Física"
  }
]
```

---

## /perguntas/ ❓

### POST - /perguntas/

**Descrição:** Cadastra uma nova pergunta.
**Autorização:** Professores e Administradores

**Conteúdo da requisição:**

| Campo        | Tipo   | Obrigatório | Descrição                     |
| ------------ | ------ | ----------- | ----------------------------- |
| idAssunto    | int    | Sim         | ID do assunto da pergunta     |
| descricao    | string | Sim         | Texto da pergunta             |
| dificuldade  | string | Sim         | 'facil', 'medio' ou 'dificil' |
| tempoSeg     | int    | Sim         | Tempo em segundos             |
| respostas    | array  | Sim         | Lista de opções de resposta   |
| figuraBase64 | string | Não         | Imagem em base64              |

```json
{
  "idAssunto": 2,
  "descricao": "Qual é a capital da França?",
  "dificuldade": "facil",
  "tempoSeg": 30,
  "respostas": [
    {"descricao": "Paris", "ehCorreta": true},
    {"descricao": "Londres", "ehCorreta": false}
  ],
  "figuraBase64": null
}
```

**Formato de Resposta:**
Nenhum conteúdo (HTTP 204)

---

### GET - /perguntas/

**Descrição:** Lista todas as perguntas ou filtra por assunto através do parâmetro `id_assunto`.
**Autorização:** Professores e Administradores

**Parâmetros:**

| Nome       | Tipo | Obrigatório | Descrição                           |
| ---------- | ---- | ----------- | ----------------------------------- |
| id_assunto | int  | Não         | Filtra perguntas pelo ID do assunto |

**Formato de Resposta:**

```json
[
  {
		"descricao": "Quanto é 2/3 + 1/6?",
		"caminhoImg": null,
		"tempoSeg": 30,
		"dificuldade": "Médio",
		"descricaoAssunto": "Frações",
		"ultimaAtualizacao": "23/11/2025 20:44:36",
		"respostas": [
			{
				"ehCorreta": false,
				"descricao": "3/9"
			},
			{
				"ehCorreta": true,
				"descricao": "5/6"
			}
		]
	}
]
```

---

## /login/ 🔑

### POST - /login/

**Descrição:** Inicia uma sessão para o usuário.
**Autorização:** Usuários não logados

**Conteúdo da requisição:**

| Campo | Tipo   | Obrigatório | Descrição         |
| ----- | ------ | ----------- | ----------------- |
| email | string | Sim         | E-mail do usuário |
| senha | string | Sim         | Senha do usuário  |

```json
{
  "email": "joao@examplo.com",
  "senha": "senha123"
}
```

**Formato de Resposta:**

```json
{
  "nome": "João Silva",
  "tipoUsuario": "aluno"
}
```

---

### DELETE - /login/

**Descrição:** Encerra a sessão do usuário logado.
**Autorização:** Usuários logados

---

## /relatorios/ 📊

### GET - /relatorios/rankingPorPontuacaoGeral

**Descrição:** Ranking de alunos por pontuação geral.
**Autorização:** Alunos, Professores e Administradores

**Parâmetros:**

| Nome  | Tipo   | Obrigatório | Descrição               |
| ----- | ------ | ----------- | ----------------------- |
| busca | string | Não         | Filtra alunos pelo nome |

**Formato de Resposta:**

```json
[
  {
    "posicao": 1,
    "nome": "João Silva",
    "pontuacaoGeral": 95.0
  }
]
```

---

### GET - /relatorios/rankingAlunosPorCurso

**Descrição:** Ranking de alunos por pontuação em cada curso.
**Autorização:** Alunos, Professores e Administradores

**Parâmetros:**

| Nome  | Tipo   | Obrigatório | Descrição                         |
| ----- | ------ | ----------- | --------------------------------- |
| busca | string | Não         | Filtra alunos ou cursos pelo nome |

**Formato de Resposta:**

```json
[
  {
    "descricao": "Matemática Básica",
    "posicao": 1,
    "nomeAluno": "João Silva",
    "pontuacao": 50
  }
]
```

---

### GET - /relatorios/numeroDeAlunosPorCurso

**Descrição:** Retorna a quantidade de alunos por curso.
**Autorização:** Professores e Administradores

**Formato de Resposta:**

```json
[
  {
    "descricao": "Matemática Básica",
    "quantidade": 25
  }
]
```
