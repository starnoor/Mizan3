// Currency Converter Logic
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultParagraph = document.getElementById('result');
const favoriteCurrenciesList = document.getElementById('favoriteCurrenciesList');

let exchangeRates = {};
let favoriteCurrencies = JSON.parse(localStorage.getItem('favoriteCurrencies')) || [];

// Fetch currency list and exchange rates
async function fetchCurrencies() {
    try {
        // Using a free API for currency list and exchange rates. Note: This API might have limitations.
        // A more robust solution would involve a paid API or a backend service.
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`); // Using USD as base for initial fetch
        const data = await response.json();
        exchangeRates = data.rates;

        const currencies = Object.keys(exchangeRates);
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            toCurrencySelect.appendChild(option2);
        });

        // Set default currencies
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';

        renderFavoriteCurrencies();
    } catch (error) {
        console.error('Error fetching currencies:', error);
        resultParagraph.textContent = 'Error fetching currency data.';
    }
}

// Perform currency conversion
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultParagraph.textContent = 'Please enter a valid amount.';
        return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        resultParagraph.textContent = 'Invalid currency selected.';
        return;
    }

    // Convert to USD first, then to target currency
    const amountInUSD = amount / exchangeRates[fromCurrency];
    const convertedAmount = amountInUSD * exchangeRates[toCurrency];

    resultParagraph.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

// Add/Remove favorite currency
function toggleFavoriteCurrency(currency) {
    const index = favoriteCurrencies.indexOf(currency);
    if (index > -1) {
        favoriteCurrencies.splice(index, 1);
    } else {
        favoriteCurrencies.push(currency);
    }
    localStorage.setItem('favoriteCurrencies', JSON.stringify(favoriteCurrencies));
    renderFavoriteCurrencies();
}

// Render favorite currencies
function renderFavoriteCurrencies() {
    favoriteCurrenciesList.innerHTML = '';
    if (favoriteCurrencies.length === 0) {
        favoriteCurrenciesList.innerHTML = '<p>No favorite currencies yet. Select one from the dropdowns and convert to add.</p>';
        return;
    }
    favoriteCurrencies.forEach(currency => {
        const tag = document.createElement('span');
        tag.classList.add('favorite-currency-tag');
        tag.innerHTML = `
            ${currency}
            <i data-feather="x-circle" class="remove-fav" data-currency="${currency}"></i>
        `;
        favoriteCurrenciesList.appendChild(tag);
    });
    feather.replace(); // Re-initialize feather icons for new elements
}

// Cryptocurrency Tracker Logic
const cryptoListDiv = document.getElementById('cryptoList');
const cryptoChartCanvas = document.getElementById('cryptoChart');
let cryptoChart;

// Fetch cryptocurrency prices (using CoinGecko API as an example)
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,litecoin,cardano&vs_currencies=usd');
        const data = await response.json();
        displayCryptoPrices(data);
        updateCryptoChart(data);
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        cryptoListDiv.innerHTML = '<p>Error fetching cryptocurrency data.</p>';
    }
}

// Display cryptocurrency prices
function displayCryptoPrices(data) {
    cryptoListDiv.innerHTML = '';
    for (const [crypto, prices] of Object.entries(data)) {
        const cryptoCard = document.createElement('div');
        cryptoCard.classList.add('crypto-card');
        cryptoCard.innerHTML = `
            <img src="https://www.coingecko.com/coins/${crypto}/large/" alt="${crypto} icon">
            <h4>${crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h4>
            <p class="price">$${prices.usd.toFixed(2)}</p>
        `;
        cryptoListDiv.appendChild(cryptoCard);
    }
}

// Update cryptocurrency chart
function updateCryptoChart(data) {
    const labels = Object.keys(data).map(crypto => crypto.charAt(0).toUpperCase() + crypto.slice(1));
    const prices = Object.values(data).map(prices => prices.usd);

    if (cryptoChart) {
        cryptoChart.destroy();
    }

    cryptoChart = new Chart(cryptoChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price in USD',
                data: prices,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'var(--text-color)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'var(--text-color)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'var(--text-color)'
                    }
                }
            }
        }
    });
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);

// Add event listener for adding/removing favorite currencies
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-fav')) {
        const currency = event.target.dataset.currency;
        toggleFavoriteCurrency(currency);
    }
});

// Add selected currencies to favorites when conversion is successful
convertBtn.addEventListener('click', () => {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    if (parseFloat(amountInput.value) > 0) { // Only add to favorites if conversion is valid
        if (!favoriteCurrencies.includes(fromCurrency)) {
            toggleFavoriteCurrency(fromCurrency);
        }
        if (!favoriteCurrencies.includes(toCurrency)) {
            toggleFavoriteCurrency(toCurrency);
        }
    }
});

// Initializations on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchCurrencies();
    fetchCryptoPrices();

    // Refresh crypto prices every 5 minutes
    setInterval(fetchCryptoPrices, 5 * 60 * 1000);
});