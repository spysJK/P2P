let price = 0;
const fee = 1.06;

// GET PRICE
async function getPrice() {
    try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=USDTBRL");
        const data = await res.json();

        const basePrice = parseFloat(data.price);
        price = basePrice * fee;

        document.getElementById("livePrice").textContent = `R$ ${price.toFixed(2)}`;

        calcUSDT();
        calcBRL();

    } catch (e) {
        console.log("Erro ao obter preço:", e);
    }
}

// INPUT SANITIZER
function cleanInput(el) {
    if (el.value === "" || el.value === "0" || parseFloat(el.value) === 0) {
        el.value = "";
    }
}

function calcUSDT() {
    const brl = parseFloat(document.getElementById("brl").value) || 0;
    document.getElementById("usdt").value = price ? (brl / price).toFixed(2) : "";
}

function calcBRL() {
    const usdt = parseFloat(document.getElementById("usdt").value) || 0;
    document.getElementById("brl").value = price ? (usdt * price).toFixed(2) : "";
}

getPrice();
setInterval(getPrice, 5000);

