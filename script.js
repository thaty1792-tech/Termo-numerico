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
    
    // Foca na primeira caixa apenas se não for mobile para não abrir teclado acidentalmente
    if (window.innerWidth > 768) {
        setTimeout(focarPrimeiraCaixa, 100);
    }
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
            input.maxLength = 1;
            input.classList.add("caixa-letra");
            input.id = `caixa${i}${j}`;
            input.autocomplete = "off";
            
            // Bloqueia o teclado nativo do celular
            if (window.innerWidth <= 768) {
                input.inputMode = "none"; 
            } else {
                input.inputMode = "numeric";
            }

            // Eventos para teclado físico (Desktop)
            input.addEventListener('input', (e) => {
                if (numerosPermitidos.test(e.target.value)) {
                    focarProxima(i, j);
                } else {
                    e.target.value = "";
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === "Backspace" && !e.target.value) {
                    focarAnterior(i, j);
                }
            });

            linha.appendChild(input);
        }
        caixasElement.appendChild(linha);
    }
}

// --- Lógica do Teclado Virtual ---

function digitarNoTeclado(numero) {
    const col = obterColunaAtual();
    const inputAtual = document.getElementById(`caixa${tentativas}${col}`);
    
    if (inputAtual && inputAtual.value === "") {
        inputAtual.value = numero;
        focarProxima(tentativas, col);
    }
}

function apagarNoTeclado() {
    let col = obterColunaAtual();
    let inputAtual = document.getElementById(`caixa${tentativas}${col}`);
    
    // Se a caixa atual estiver vazia, apaga a anterior
    if (inputAtual.value === "" && col > 0) {
        const inputAnterior = document.getElementById(`caixa${tentativas}${col - 1}`);
        inputAnterior.value = "";
    } else {
        inputAtual.value = "";
    }
}

function obterColunaAtual() {
    const linha = document.querySelectorAll(".linha-caixas")[tentativas];
    const caixas = linha.querySelectorAll(".caixa-letra");
    for (let i = 0; i < caixas.length; i++) {
        if (caixas[i].value === "") return i;
    }
    return TAMANHO_CODIGO - 1; // Retorna a última se estiver tudo cheio
}

// --- Verificação e Regras ---

function verificarPalavra() {
    const linhas = document.querySelectorAll(".linha-caixas");
    const caixas = linhas[tentativas].getElementsByClassName("caixa-letra");

    let palpite = "";
    for (let c of caixas) palpite += c.value;

    if (palpite.length < TAMANHO_CODIGO) return;

    let resultadoCores = new Array(TAMANHO_CODIGO).fill("cinza");
    let contagemSecretos = {};

    for (let num of palavraSecreta) {
        contagemSecretos[num] = (contagemSecretos[num] || 0) + 1;
    }

    let acertos = 0;
    // Primeiro passo: Verdes
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
        if (palpite[i] === palavraSecreta[i]) {
            resultadoCores[i] = "verde";
            contagemSecretos[palpite[i]]--;
            acertos++;
        }
    }

    // Segundo passo: Amarelos
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
        if (resultadoCores[i] === "cinza") {
            let numPalpite = palpite[i];
            if (contagemSecretos[numPalpite] > 0) {
                resultadoCores[i] = "amarelo";
                contagemSecretos[numPalpite]--;
            }
        }
    }

    // Aplicar Cores Visuais
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
            // Foca na nova linha apenas se não for mobile
            if (window.innerWidth > 768) {
                document.getElementById(`caixa${tentativas}0`).focus();
            }
        }
    }
}

// --- Auxiliares de Navegação ---

function focarPrimeiraCaixa() {
    const primeira = document.getElementById("caixa00");
    if (primeira) primeira.focus();
}

function focarProxima(l, c) {
    if (c < TAMANHO_CODIGO - 1) {
        const prox = document.getElementById(`caixa${l}${c+1}`);
        if (prox && window.innerWidth > 768) prox.focus();
    }
}

function focarAnterior(l, c) {
    if (c > 0) {
        const ant = document.getElementById(`caixa${l}${c-1}`);
        if (ant && window.innerWidth > 768) ant.focus();
    }
}

function bloquearTudo() {
    document.querySelectorAll(".caixa-letra").forEach(c => c.disabled = true);
    // Esconde o teclado virtual ao fim do jogo
    document.getElementById("teclado-virtual").style.display = "none";
}

function mostrarPopup() { document.getElementById("popup").style.display = "block"; }
function fecharPopup() { document.getElementById("popup").style.display = "none"; }

window.onload = iniciarJogo;
