const zakatGoldInput = document.getElementById('zakatGold');
const zakatSilverInput = document.getElementById('zakatSilver');
const zakatCashInput = document.getElementById('zakatCash');
const zakatInvestmentsInput = document.getElementById('zakatInvestments');
const zakatDebtsInput = document.getElementById('zakatDebts');
const calculateZakatBtn = document.getElementById('calculateZakatBtn');
const zakatResultParagraph = document.getElementById('zakatResult');

function calculateZakat() {
    const gold = parseFloat(zakatGoldInput.value) || 0;
    const silver = parseFloat(zakatSilverInput.value) || 0;
    const cash = parseFloat(zakatCashInput.value) || 0;
    const investments = parseFloat(zakatInvestmentsInput.value) || 0;
    const debts = parseFloat(zakatDebtsInput.value) || 0;

    const totalAssets = gold + silver + cash + investments;
    const netWealth = totalAssets - debts;

    // Nisab value (example: 85 grams of gold, current price of gold per gram in SAR)
    // This should ideally be fetched dynamically or updated regularly
    const nisabGoldPricePerGram = 250; // Example: 250 SAR per gram of gold
    const nisab = 85 * nisabGoldPricePerGram; // Nisab for gold in SAR

    if (netWealth >= nisab) {
        const zakatAmount = netWealth * 0.025; // 2.5% of net wealth
        zakatResultParagraph.textContent = `Your Zakat due is: ${zakatAmount.toFixed(2)} SAR`;
        zakatResultParagraph.style.color = 'var(--accent-color)';
    } else {
        zakatResultParagraph.textContent = `Your net wealth (${netWealth.toFixed(2)} SAR) is below the Nisab (${nisab.toFixed(2)} SAR). No Zakat is due.`;
        zakatResultParagraph.style.color = 'var(--secondary-color)';
    }
}



// Loan Calculator Logic
const loanAmountInput = document.getElementById('loanAmount');
const interestRateInput = document.getElementById('interestRate');
const loanTermInput = document.getElementById('loanTerm');
const calculateLoanBtn = document.getElementById('calculateLoanBtn');
const loanResultParagraph = document.getElementById('loanResult');
const scheduleBody = document.getElementById('scheduleBody');

function calculateLoan() {
    const loanAmount = parseFloat(loanAmountInput.value) || 0;
    const annualInterestRate = parseFloat(interestRateInput.value) || 0;
    const loanTermYears = parseFloat(loanTermInput.value) || 0;

    if (loanAmount <= 0 || annualInterestRate < 0 || loanTermYears <= 0) {
        loanResultParagraph.textContent = 'Please enter valid loan details.';
        loanResultParagraph.style.color = 'var(--secondary-color)';
        scheduleBody.innerHTML = '';
        return;
    }

    const monthlyInterestRate = (annualInterestRate / 100) / 12;
    const numberOfPayments = loanTermYears * 12;

    let monthlyPayment;
    if (monthlyInterestRate === 0) {
        monthlyPayment = loanAmount / numberOfPayments;
    } else {
        monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }

    loanResultParagraph.textContent = `Monthly Payment: ${monthlyPayment.toFixed(2)} SAR`;
    loanResultParagraph.style.color = 'var(--accent-color)';

    // Generate Payment Schedule
    scheduleBody.innerHTML = '';
    let remainingBalance = loanAmount;

    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        const row = scheduleBody.insertRow();
        row.insertCell().textContent = i;
        row.insertCell().textContent = principalPayment.toFixed(2);
        row.insertCell().textContent = interestPayment.toFixed(2);
        row.insertCell().textContent = monthlyPayment.toFixed(2);
        row.insertCell().textContent = Math.max(0, remainingBalance).toFixed(2); // Ensure balance doesn't go negative
    }
}



// Spending Analysis Logic (Dummy Data for now)
const spendingChartCanvas = document.getElementById('spendingChart');
const spendingSummaryDiv = document.getElementById('spendingSummary');
let spendingChart;

function renderSpendingAnalysis() {
    // Dummy transaction data for spending analysis
    const dummyTransactions = [
        { date: '2023-10-01', amount: 150, category: 'Food' },
        { date: '2023-10-02', amount: 50, category: 'Transport' },
        { date: '2023-10-03', amount: 200, category: 'Shopping' },
        { date: '2023-10-04', amount: 75, category: 'Food' },
        { date: '2023-10-05', amount: 120, category: 'Utilities' },
        { date: '2023-10-06', amount: 30, category: 'Transport' },
        { date: '2023-10-07', amount: 180, category: 'Shopping' },
    ];

    const spendingByCategory = {};
    let totalSpending = 0;

    dummyTransactions.forEach(transaction => {
        if (spendingByCategory[transaction.category]) {
            spendingByCategory[transaction.category] += transaction.amount;
        } else {
            spendingByCategory[transaction.category] = transaction.amount;
        }
        totalSpending += transaction.amount;
    });

    const categories = Object.keys(spendingByCategory);
    const amounts = Object.values(spendingByCategory);

    if (spendingChart) {
        spendingChart.destroy();
    }

    spendingChart = new Chart(spendingChartCanvas, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'var(--text-color)'
                    }
                }
            }
        }
    });

    spendingSummaryDiv.innerHTML = `
        <h3>Summary:</h3>
        <p>Total Spending: ${totalSpending.toFixed(2)} SAR</p>
        <p>Average Daily Spending: ${(totalSpending / dummyTransactions.length).toFixed(2)} SAR</p>
    `;
}

// Weekly Financial Report Logic (Dummy Data for now)
const weeklyReportContent = document.getElementById('weeklyReportContent');

function generateWeeklyReport() {
    // This would ideally pull real transaction data for the past week
    const weeklyIncome = 2000; // Dummy
    const weeklyExpenses = 850; // Dummy
    const weeklySavings = weeklyIncome - weeklyExpenses;

    weeklyReportContent.innerHTML = `
        <p><strong>Week of ${new Date().toLocaleDateString()}:</strong></p>
        <p>Total Income: ${weeklyIncome.toFixed(2)} SAR</p>
        <p>Total Expenses: ${weeklyExpenses.toFixed(2)} SAR</p>
        <p>Net Savings: ${weeklySavings.toFixed(2)} SAR</p>
        <p><em>"Keep up the great work! Every step forward counts."</em></p>
    `;
}

// Minimal Mode Logic


// Initializations on page load
document.addEventListener('DOMContentLoaded', () => {
    renderSpendingAnalysis();
    generateWeeklyReport();


});