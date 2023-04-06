const coinSelect = document.querySelector("#moneda");
const cryptoSelect = document.querySelector("#criptomonedas");
const form = document.querySelector("#formulario");
const result = document.querySelector("#resultado");

document.addEventListener("DOMContentLoaded", consultCryptos);
form.addEventListener("submit", getQuotation);

coinSelect.addEventListener("change", readValues);
cryptoSelect.addEventListener("change", readValues);

const searchOBJ = {
  coin: "",
  crypto: "",
};

async function consultCryptos() {
  const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    getCryptos(result.Data);
  } catch (error) {
      console.log(error);
  }
}

function getCryptos(cryptos) {
  cryptos.forEach((crypto) => {
    const { FullName, Name } = crypto.CoinInfo;
    const optionCrypto = document.createElement("OPTION");
    optionCrypto.value = Name;
    optionCrypto.textContent = FullName;

    cryptoSelect.appendChild(optionCrypto);
  });
}

function readValues(e) {
  searchOBJ[e.target.name] = e.target.value;
}

function getQuotation(e) {
  e.preventDefault();
  const { coin, crypto } = searchOBJ;

  if (!coin || !crypto) {
    printAlert("Faltan datos para cotizar");
    return;
  } else {
    apiConsult();
  }
}

function printAlert(message) {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  const alert = document.createElement("P");
  alert.classList.add("error");
  alert.textContent = message;

  result.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 2000);
}

async function apiConsult() {
  const { coin, crypto } = searchOBJ;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${coin}`;
  showSpinner();

  try {
     const response = await fetch();
     const result = await response.json();
     showQuotation(result.DISPLAY[crypto][coin]);
  } catch (error){
     console.log(error);
  }
 
  
}

function showQuotation(quotation) {
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = quotation;

  cleanHTML(result);

  const price = document.createElement("P");
  price.classList.add("precio");
  price.innerHTML = `
    El precio es: <span>${PRICE}</span>
  `;

  const highPrice = document.createElement("P");
  highPrice.innerHTML = `
    El precio más alto del día: <span>${HIGHDAY}</span>
  `;

  const lowPrice = document.createElement("P");
  lowPrice.innerHTML = `
    El precio más bajo del día: <span>${LOWDAY}</span>
  `;

  const lastHours = document.createElement("P");
  lastHours.innerHTML = `
    Variación ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>
  `;

  const lastUpdate = document.createElement("P");
  lastUpdate.innerHTML = `
    Última actualización:<span> ${LASTUPDATE}</span>
  `;

  result.appendChild(price);
  result.appendChild(highPrice);
  result.appendChild(lowPrice);
  result.appendChild(lastHours);
  result.appendChild(lastUpdate);
}

function cleanHTML(elementHTML) {
  if (elementHTML.firstChild) {
    while (elementHTML.firstChild) {
      elementHTML.removeChild(elementHTML.firstChild);
    }
  } else {
    return;
  }
}

function showSpinner() {
  cleanHTML(result);

  const spinner = document.createElement("DIV");
  spinner.classList.add("spinner");
  spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
  `;

  result.appendChild(spinner);
}
