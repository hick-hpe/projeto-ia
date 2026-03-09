const express = require("express");
const { marked } = require("marked");
const createDOMPurify = require('dompurify');
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const session = require("express-session");

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.use(session({
    secret: "segredo",
    resave: false,
    saveUninitialized: true
}));

app.post("/chat", async (req, res) => {

    const { prompt, regras } = req.body;

    if (!req.session.mensagens) {
        req.session.mensagens = [
            {
                role: "system",
                content: `
Você é um assistente educado e prestativo.

Regras:
- Se houver erros de digitação ou gramática na mensagem do usuário, corrija-os de forma gentil.
- Mostre a forma correta sem constranger o usuário.
- Continue a resposta normalmente após a correção.
`.trim()
            }
        ];
    }

    if (!prompt) {
        res.json({ resposta: "Você não pode deixar este campo vazio!!!" });
        return;
    }

    const promptLimpo = DOMPurify.sanitize(prompt);

    adicionarConfiguracoesDoChat(req, regras);

    adicionarMensagemAoChat(req, promptLimpo, "user");

    const controller = new AbortController();

    try {
        const response = await fetch("http://localhost:11434/api/chat", {
            signal: controller.signal,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-oss:120b-cloud",
                prompt: prompt,
                messages: req.session.mensagens,
                stream: false,
            })
        });

        const data = await response.json();

        const html = marked(data.message.content).trim();

        adicionarMensagemAoChat(req, html, "assistant");

        res.json({
            resposta: html
        });

    } catch (err) {
        console.log('Erro:', err);
        res.json({
            resposta: "Ocorreu algum erro durante a resposta :("
        });
    }

    setTimeout(() => {
        controller.abort();
    }, 5000);

});

app.listen(3000, () => {
    console.log("Servidor rodando em: http://localhost:3000");
});

function adicionarConfiguracoesDoChat(req, regras) {

    const systemPrompt = `
Você é um assistente útil.

Regras:
- Idioma da resposta: ${regras.idioma}
- Tom da conversa: ${regras.tom}
- Nível de detalhe: ${regras.detalhe}

Siga sempre essas configurações ao responder.
`.trim();

    req.session.mensagens.push({
        role: "user",
        content: req.body.prompt
    });

    if (req.session.mensagens.length && req.session.mensagens[0].role === "system") {
        req.session.mensagens[0].content = systemPrompt;
    } else {
        req.session.mensagens.unshift({
            role: "system",
            content: systemPrompt

        });
    }
}

function adicionarMensagemAoChat(req, content, role) {
    const mensagem = { role, content };
    req.session.mensagens.push(mensagem);
}

