let palavraSecreta = "";
let tentativas = 0;
const MAX_TENTATIVAS = 7;
const TAMANHO_CODIGO = 5;
const numerosPermitidos = /^[0-9]$/;

const codigosDisponiveis = ["10101", "12123", "55005", "11223", "98765", "00001", "12345", "54321", "80808", "90901"];

function iniciarJogo() {
    palavraSecreta = codigosDisponiveis[Math.floor(Math.random() * codigosDisponiveis.length)];
    tentativas = 0;
    document.getElementById("resultado").textContent = "";
    document.getElementById("resultado").style.color = "#007bff";
    criarCaixas();
    focarPrimeiraCaixa();
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
            input.inputMode = "numeric";
            input.maxLength = 1;
            input.classList.add("caixa-letra");
            input.id = `caixa${i}${j}`;
            
            input.addEventListener('input', (e) => {
                if (numerosPermitidos.test(e.target.value)) {
                    focarProxima(i, j);
                } else {
                    e.target.value = "";
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === "Backspace" && !e.target.value) focarAnterior(i, j);
                if (e.key === "Enter") verificarPalavra();
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
        alert("Preencha todos os 5 números!");
        return;
    }

    let resultadoCores = new Array(TAMANHO_CODIGO).fill("cinza");
    let contagemSecretos = {};

    for (let num of palavraSecreta) {
        contagemSecretos[num] = (contagemSecretos[num] || 0) + 1;
    }

    let acertos = 0;
    // Primeira passada: Verdes
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
        if (palpite[i] === palavraSecreta[i]) {
            resultadoCores[i] = "verde";
            contagemSecretos[palpite[i]]--;
            acertos++;
        }
    }

    // Segunda passada: Amarelos
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
        if (resultadoCores[i] === "cinza") {
            let numPalpite = palpite[i];
            if (contagemSecretos[numPalpite] > 0) {
                resultadoCores[i] = "amarelo";
                contagemSecretos[numPalpite]--;
            }
        }
    }

    // Aplicar Cores
    for (let i = 0; i < TAMANHO_CODIGO; i++) {
        caixas[i].style.color = "white";
        if (resultadoCores[i] === "verde") caixas[i].style.backgroundColor = "#6aaa64";
        else if (resultadoCores[i] === "amarelo") caixas[i].style.backgroundColor = "#c9b458";
        else caixas[i].style.backgroundColor = "#787c7e";
    }

    if (acertos === TAMANHO_CODIGO) {
        document.getElementById("resultado").textContent = "Parabéns! Código correto!";
        document.getElementById("resultado").style.color = "green";
        bloquearTudo();
    } else {
        tentativas++;
        if (tentativas === MAX_TENTATIVAS) {
            document.getElementById("resultado").textContent = `Fim de jogo! O código era: ${palavraSecreta}`;
            document.getElementById("resultado").style.color = "red";
            bloquearTudo();
        } else {
            linhas[tentativas].classList.remove("linha-bloqueada");
            document.getElementById(`caixa${tentativas}0`).focus();
        }
    }
}

function focarPrimeiraCaixa() { document.getElementById("caixa00").focus(); }
function focarProxima(l, c) { const prox = document.getElementById(`caixa${l}${c+1}`); if(prox) prox.focus(); }
function focarAnterior(l, c) { const ant = document.getElementById(`caixa${l}${c-1}`); if(ant) ant.focus(); }
function bloquearTudo() { document.querySelectorAll(".caixa-letra").forEach(c => c.disabled = true); }
function mostrarPopup() { document.getElementById("popup").style.display = "block"; }
function fecharPopup() { document.getElementById("popup").style.display = "none"; }

window.onload = iniciarJogo;