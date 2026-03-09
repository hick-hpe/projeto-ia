const divChatInput = document.getElementById("chat-input");
const divChatBox = document.getElementById("chat-box");
const divPrompt = document.getElementById("prompt");
const tom = document.getElementById("tom");
const detalhe = document.getElementById("detalhe");
const idioma = document.getElementById("idioma");

// eventos
divChatInput.addEventListener("submit", (e) => {
    e.preventDefault();
})

divPrompt.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviar();
    }

});

divPrompt.addEventListener("input", () => {
    divPrompt.style.height = "auto";
    divPrompt.style.height = divPrompt.scrollHeight + "px";
});

const mensagens = [];

async function enviar() {

    const prompt = divPrompt.value;
    divPrompt.value = "";
    divPrompt.focus();

    if (!prompt) {
        alert("Você não pode deixar este campo vazio!!!");
        return;
    }

    adicionarMensagemAoChat(prompt, "user");

    adicionarMensagemTempCarregamento();

    scrollParaUltimaMensagem();

    const regras = {
        tom: tom.value,
        detalhe: detalhe.value,
        idioma: idioma.value
    };

    const res = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt,
            regras
        })
    });

    const data = await res.json();
    const respostaIA = data.resposta;

    excluirMensagemTempCarregamento();

    adicionarMensagemAoChat(respostaIA, "assistant");
}

function adicionarMensagemAoChat(content, role) {
    console.log(`Mensagem: "${content}"`);
    const mensagem = { role, content };
    exibirMensagem(mensagem);
}

function escaparHTML(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function sanitizarPrompt(mensagem) {

    mensagem = mensagem.trim();
    mensagem = escaparHTML(mensagem);
    mensagem = mensagem.replace(/\n/g, "<br>");

    return mensagem;

}

function criarMensagemUser(mensagem) {
    mensagem = sanitizarPrompt(mensagem);
    return `<div class="message message-user"><div class="text-message">${mensagem}</div></div>`
}

function criarMensagemChat(mensagem) {
    return `
        <div class="message message-chat">
            <div class="text-message">${mensagem}</div>
        </div>
    `
}

function exibirMensagem(mensagem) {

    const { role, content } = mensagem;
    let mensagemHTML;

    if (role === "user") {
        mensagemHTML = criarMensagemUser(content);
    } else {
        mensagemHTML = criarMensagemChat(content);
    }

    divChatBox.innerHTML += mensagemHTML;
}

function adicionarMensagemTempCarregamento() {
    const divLoading = document.createElement("div");
    divLoading.className = "loading";
    divLoading.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;
    divChatBox.appendChild(divLoading);
}

function excluirMensagemTempCarregamento() {
    const divLoading = document.querySelector(".loading");
    if (divLoading) divLoading.remove();
}

function scrollParaUltimaMensagem() {
    divChatBox.scroll({
        top: divChatBox.scrollHeight,
        behavior: "smooth"
    });
}


