# Instruções do Projeto 👩‍🏫

Abaixo estão descritas as etapas necessárias para **instalar** e **executar** o projeto corretamente.

---

## 🧰 Pré-requisitos

Antes de iniciar a instalação, certifique-se de que as seguintes ferramentas estão instaladas no seu sistema:

- [PHP](https://www.php.net/downloads.php)
- [Composer](https://getcomposer.org/download)
- [Node.js](https://nodejs.org/en/download/current)  
- [pnpm](https://pnpm.io/installation)  
- [MySQL](https://www.apachefriends.org/pt_br/download.html)

Além disso, as variáveis de ambiente das ferramentas devem estar devidamente configuradas para permitir a execução dos scripts.

---

## 🧩 Instalando

### **1. Clonagem do Repositório**

No repositório do projeto no **GitLab**, clique em **`Code`** e copie o link de clonagem.
Em seguida, execute o comando abaixo no terminal:

```bash
git clone https://gitlab.com/cefet-nf/pis-2025-2/g2.git
```

---

### **2. Execução dos Scripts SQL**

Antes de executar os scripts, configure as informações de conexão no arquivo [`conexao.php`](../api/src/config/conexao.php), preenchendo os dados do seu banco de dados:

```php
const HOST = 'localhost';
const USUARIO = 'root';
const SENHA = '';
```

A partir desse ponto, você pode configurar o banco de dados de duas formas:

---

#### **Executando via Composer**

1. Acesse o diretório [`api`](../api/) e execute o comando:

```bash
composer db
```

Este comando criará a estrutura do banco e populará com os dados iniciais automaticamente.

---

#### **Executando manualmente**

Os scripts de banco de dados estão localizados no diretório [`/api/db`](../api/db/).

1. **Criar a estrutura do banco:**

   * Abra o arquivo [`estrutura.sql`](../api/db/producao/estrutura.sql).
   * Copie todo o conteúdo e execute-o em uma ferramenta de gerenciamento MySQL, como **phpMyAdmin**, **DBeaver** ou similar.

2. **Popular o banco com dados iniciais:**

   * Abra o arquivo [`dados.sql`](../api/db/producao/dados.sql).
   * Copie o script e execute-o na mesma ferramenta para inserir os dados iniciais.

---


### **3. Instalação das Dependências**

Após clonar o repositório, será necessário instalar as dependências da **API** e do **frontend**.

#### 🧱 API

Acesse o diretório da [API](../api/) e execute o comando:

```bash
composer install
```

#### 💻 Frontend

Em seguida, vá até o diretório do [frontend](../frontend/) e rode:

```bash
pnpm install
```


✅ **Pronto!**
O projeto está devidamente instalado e configurado, pronto para ser executado em sua máquina.

---

## 🚀 Executando

Com o projeto instalado, você já pode executá-lo e testá-lo em sua máquina. Abaixo estão os comandos necessários para iniciar a API e o frontend:

---

### **1. Iniciando a API**

Acesse o diretório [`/api/`](../api/) e execute o comando:

```bash
composer api
```

Após a execução, a API estará rodando localmente em [http://localhost:8080](http://localhost:8080).

---

### **2. Iniciando o Frontend**

Acesse o diretório do frontend [`/frontend/`](../frontend/) e execute:

```bash
pnpm start
```

A aplicação frontend será iniciada na porta 5173, acessível em [http://localhost:5173](http://localhost:5173), pronta para ser testada e utilizada.

## 🧪 Testes Automatizados

### Backend

Para executar os testes do backend, acesse o diretório da [API](../api/) e rode o comando:

```bash
composer test
```

Isso irá executar todos os testes automatizados configurados para a API.

### Frontend

Para executar os testes end-to-end do frontend, acesse o diretório do [frontend](../frontend/) e utilize um dos comandos abaixo:

**Modo HEADED**
```bash
pnpm e2e
```

**Modo UI:**
```bash
pnpm e2e-ui
```

Esses comandos permitem validar o funcionamento completo da aplicação em um ambiente de teste seguro.

---

## Pronto ☑
Agora, seguindo esses comandos, você já sabe como rodar o projeto! Sinta-se à vontade para testá-lo e lembre-se de manter suas dependências sempre atualizadas. 😉

---