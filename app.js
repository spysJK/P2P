/* ================================
      CONFIGURAÇÃO DE TAXA
================================ */

const FEE = 1.03; // +3% sobre qualquer valor


/* ================================
      CONFIGURAÇÃO DE PACOTES
================================ */

// Preço base dos pacotes (antes da taxa)
const packages = [
    { usdt: 50, brl: 300 },
    { usdt: 100, brl: 600 },
    { usdt: 200, brl: 1200 }
];

// Aplica +3% automaticamente
function packageWithFee(brlValue) {
    return brlValue * FEE;
}


/* ================================
      PREÇOS POR FAIXA
================================ */

function priceByTier(usdt) {
    if (usdt >= 10 && usdt <= 100) return 6.20;
    if (usdt >= 101 && usdt <= 500) return 6.10;
    if (usdt > 500) return 6.05;
    return null;
}

// aplica taxa nos preços por faixa
function tierPriceWithFee(usdt) {
    const baseRate = priceByTier(usdt);
    if (!baseRate) return null;
    return baseRate * FEE;
}


/* ================================
      LIVE PRICE DA BINANCE (+3%)
================================ */

async function getPrice() {
    try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=USDTBRL");
        const data = await res.json();

        const basePrice = parseFloat(data.price);
        const priceWithFee = basePrice * FEE;

        document.getElementById("livePrice").textContent = 
            `R$ ${priceWithFee.toFixed(2)}`;

    } catch (e) {
        console.log("Erro ao obter preço:", e);
    }
}

getPrice();
setInterval(getPrice, 5000);


/* ================================
      ÁREA DE RENDERIZAÇÃO
================================ */

function renderPackages() {
    const box = document.getElementById("dynamicArea");
    box.innerHTML = `
        <h3>Pacotes Prontos</h3>
        <div class="package-table">
            ${packages.map(p => `
                <div class="package-item" onclick="selectPackage(${p.usdt}, ${packageWithFee(p.brl)})">
                    <strong>${p.usdt} USDT</strong>
                    <span>R$ ${packageWithFee(p.brl).toFixed(2)}</span>
                </div>
            `).join("")}
        </div>
        <div id="resultBox"></div>
    `;
}

function renderTier() {
    const box = document.getElementById("dynamicArea");
    box.innerHTML = `
        <h3>Preço por Quantidade</h3>

        <label class="muted">Quantidade de USDT</label>
        <input id="tierInput" type="number" class="input" placeholder="Ex: 150" oninput="calcTier()"/>

        <div id="resultBox"></div>
    `;
}


/* ================================
      RESULTADOS
================================ */

function selectPackage(usdt, brlFinal) {
    document.getElementById("resultBox").innerHTML = `
        <div class="result-card">
            <p><strong>${usdt} USDT</strong> por</p>
            <h2>R$ ${brlFinal.toFixed(2)}</h2>
            <p style="font-size:12px;margin-top:5px;color:#777">(+3% já incluído)</p>
        </div>
    `;
}

function calcTier() {
    const amount = parseFloat(document.getElementById("tierInput").value);
    if (!amount) return;

    const rate = tierPriceWithFee(amount);

    if (!rate) {
        document.getElementById("resultBox").innerHTML =
            `<p class="muted">Quantidade mínima: 10 USDT</p>`;
        return;
    }

    const total = amount * rate;

    document.getElementById("resultBox").innerHTML = `
        <div class="result-card">
            <p>${amount} USDT × R$ ${rate.toFixed(2)}</p>
            <h2>Total: R$ ${total.toFixed(2)}</h2>
            <p style="font-size:12px;margin-top:5px;color:#777">(+3% já incluído)</p>
        </div>
    `;
}


/* ================================
      SWITCH ENTRE MODOS
================================ */

function setMode(mode) {
    if (mode === "pacotes") renderPackages();
    if (mode === "faixas") renderTier();
}

setMode("pacotes");
