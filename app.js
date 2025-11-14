let price = 0;
const fee = 1.06; // 6% sobre o preço da Binance

async function getPrice() {
    try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=USDTBRL");
        const data = await res.json();

        const binancePrice = parseFloat(data.price);

        // Preço final com taxa
        price = binancePrice * fee;

        // Atualiza na tela
        document.getElementById("livePrice").textContent = `R$ ${price.toFixed(2)}`;

        // Atualiza simulador
        calcUSDT();
        calcBRL();

    } catch (error) {
        console.log("Erro ao obter preço:", error);
    }
}

function calcUSDT() {
    const brl = parseFloat(document.getElementById("brl").value) || 0;
    if (price > 0) {
        document.getElementById("usdt").value = (brl / price).toFixed(2);
    }
}

function calcBRL() {
    const usdt = parseFloat(document.getElementById("usdt").value) || 0;
    if (price > 0) {
        document.getElementById("brl").value = (usdt * price).toFixed(2);
    }
}

getPrice();
setInterval(getPrice, 5000); // Atualiza a cada 5s
