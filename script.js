let palavraSecreta = "";
let tentativas = 0;
const MAX_TENTATIVAS = 7;
const TAMANHO_CODIGO = 5;
const numerosPermitidos = /^[0-9]$/;

const codigosDisponiveis = [
    "15594", "54321", "67890", "67676", "24680",
    "13579", "48291", "73920", "86420", "97531",
    "10293", "56478", "32098", "81726", "45902",
    "61873", "90734", "28561", "37490", "16284",
    "52918", "83647", "29475", "75319", "48162",
    "69028", "31754", "84269", "20597", "56380",
    "72914", "48620", "19375", "65829", "27490",
    "83901", "56047", "32186", "90725", "14862",
    "67539", "28410", "51973", "43098", "76284"
];

function iniciarJogo() {
    palavraSecreta = codigosDisponiveis[Math.floor(Math.random() * codigosDisponiveis.length)];
    tentativas = 0;
    document.getElementById("resultado").textContent = "";
    criarCaixas();
    setTimeout(focarPrimeiraCaixa, 100);
}

function criarCaixas() {
    const caixasElement = document.getElementById("caixas");
    caixasElement.innerHTML = "";

    for (let i = 0; i < MAX_TENTATIVAS; i++) {
        const linha = document.createElement("div");
        linha.classList.add("linha-caixas");
        if (i !== 0) linha.classList.add("linha-bloqueada");

        for (let j = 0; j < TAMANHO_CODIGO; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.inputMode = "numeric"; // Garante teclado numérico no mobile
            input.maxLength = 1;
            input.classList.add("caixa-letra");
            input.id = `caixa${i}${j}`;
            input.autocomplete = "off";
            
            // Gerencia a digitação e avanço automático
            input.addEventListener('input', (e) => {
                if (numerosPermitidos.test(e.target.value)) {
                    focarProxima(i, j);
                } else {
                    e.target.value = "";
                }
            });

            // Gerencia o Backspace e o Enter
            input.addEventListener('keydown', (e) => {
                if (e.key === "Backspace" && !e.target.value) {
                    focarAnterior(i, j);
                }
                if (e.key === "Enter") {
                    // O form cuidará de chamar verificarPalavra()
                }
            });

            linha.appendChild(input);
        }
        caixasElement.appendChild(linha);
    }
}

function verificarPalavra() {
    const linhas = document.querySelectorAll(".linha-caixas");
    const caixas = linhas[tentativas].getElementsByClassName("caixa-letra");

    let palpite = "";
    for (let c of caixas) palpite += c.value;

    if (palpite.length < TAMANHO_CODIGO) {
        return; // Não faz nada se não estiver completo
    }

    let resultadoCores = new Array(TAMANHO_CODIGO).fill("cinza");
    let contagemSecretos = {};

    for (let num of palavraSecreta) {
        contagemSecretos[num] = (contagemSecretos[num] || 0) + 1;
    }

    // Primeiro passo: Verdes (posições exatas)
    let acertos = 0;
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
        if (palpite[i] === palavraSecreta[i]) {
            resultadoCores[i] = "verde";
            contagemSecretos[palpite[i]]--;
            acertos++;
        }
    }

    // Segundo passo: Amarelos (existe em outra posição)
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
        if (resultadoCores[i] === "cinza") {
            let numPalpite = palpite[i];
            if (contagemSecretos[numPalpite] > 0) {
                resultadoCores[i] = "amarelo";
                contagemSecretos[numPalpite]--;
            }
        }
    }

    // Aplicar as cores visualmente
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
        caixas[i].style.color = "white";
        caixas[i].style.border = "none";
        if (resultadoCores[i] === "verde") caixas[i].style.backgroundColor = "#538d4e";
        else if (resultadoCores[i] === "amarelo") caixas[i].style.backgroundColor = "#b59f3b";
        else caixas[i].style.backgroundColor = "#3a3a3c";
    }

    if (acertos === TAMANHO_CODIGO) {
        document.getElementById("resultado").textContent = "Parabéns! Você acertou!";
        document.getElementById("resultado").style.color = "#538d4e";
        bloquearTudo();
    } else {
        tentativas++;
        if (tentativas === MAX_TENTATIVAS) {
            document.getElementById("resultado").textContent = `Fim de jogo! O código era: ${palavraSecreta}`;
            document.getElementById("resultado").style.color = "#818384";
            bloquearTudo();
        } else {
            linhas[tentativas].classList.remove("linha-bloqueada");
            document.getElementById(`caixa${tentativas}0`).focus();
        }
    }
}

function focarPrimeiraCaixa() {
    const primeira = document.getElementById("caixa00");
    if (primeira) primeira.focus();
}

function focarProxima(l, c) {
    if (c < TAMANHO_CODIGO - 1) {
        const prox = document.getElementById(`caixa${l}${c+1}`);
        if (prox) prox.focus();
    }
}

function focarAnterior(l, c) {
    if (c > 0) {
        const ant = document.getElementById(`caixa${l}${c-1}`);
        if (ant) ant.focus();
    }
}

function bloquearTudo() {
    document.querySelectorAll(".caixa-letra").forEach(c => c.disabled = true);
}

function mostrarPopup() { document.getElementById("popup").style.display = "block"; }
function fecharPopup() { document.getElementById("popup").style.display = "none"; }

window.onload = iniciarJogo;