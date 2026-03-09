# Projeto IA com Ollama

Aplicação de chat com IA utilizando **Node.js**, **Express** e o **Ollama** para executar modelos localmente.

## 🛠️ Tecnologias utilizadas

- `express`: servidor web
- `marked`: conversão de Markdown para HTML
- `dompurify`: sanitização de HTML
- `jsdom`: suporte ao DOM no Node.js

## ⚙️ Como funciona

- O usuário envia uma mensagem pelo chat.
- O servidor Node.js + Express recebe a requisição.
- A mensagem é enviada para a API local do Ollama.
- O modelo gera uma resposta.
- A resposta é convertida de Markdown para HTML usando marked.
- O HTML é sanitizado com DOMPurify para evitar XSS.

## 📦 Requisitos do projeto

Antes de iniciar, você precisa ter instalado:

- Node.js (v18 ou superior)
- Ollama

Download do Ollama:

https://ollama.com/download

## 🔧 Instalação

- Clone o projeto:
    ```bash
    git clone https://github.com/seu-usuario/projeto-ia
    cd projeto-ia
    ```

- Instale as dependências:
    ```bash
    npm install
    ```

## 📁 Estrutura do projeto
```
projeto-ia
│
├── public
│   ├── css
│   │   └── style.css
│   │
│   ├── js
│   │   └── script.js
│   │
│   └── index.html
│
├── src
│   └── server.js
│
├── package.json
└── README.md
```

## 🚀 Executar o servidor
Execute
```bash
npm start
```

Servidor disponível em: [http://localhost:3000/](http://localhost:3000/)

