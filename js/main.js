document.addEventListener('DOMContentLoaded', function() {
    const isDemo = localStorage.getItem('isDemo') === 'true';
    let userSettings;

    if (isDemo) {
        userSettings = JSON.parse(localStorage.getItem('demoUser'));
    } else {
        userSettings = JSON.parse(localStorage.getItem('userSettings'));
    }

    // Mock data for demonstration
    const mockTransactions = [
        { type: 'income', description: 'راتب', amount: 5000 },
        { type: 'expense', description: 'إيجار', amount: 1500 },
        { type: 'expense', description: 'بقالة', amount: 400 },
        { type: 'income', description: 'عمل مستقل', amount: 750 },
        { type: 'expense', description: 'فاتورة كهرباء', amount: 200 },
    ];

    function applyTheme(theme) {
        document.body.classList.remove('light', 'dark'); // Clear existing theme classes
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.add('light');
        }
    }

    function updateDashboard(user, transactions) {
        if (!user) return;

        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = user.firstName;
        }

        const currency = user.currency || 'USD';

        let totalIncome = 0;
        let totalExpense = 0;

        const transactionsList = document.querySelector('.recent-transactions .transactions-list');
        if (transactionsList) {
            transactionsList.innerHTML = ''; // Clear placeholder

            if (transactions.length > 0) {
                transactions.forEach(tx => {
                    if (tx.type === 'income') {
                        totalIncome += tx.amount;
                    } else {
                        totalExpense += tx.amount;
                    }

                    const txElement = document.createElement('div');
                    txElement.classList.add('transaction-item');
                    txElement.innerHTML = `
                        <span class="description">${tx.description}</span>
                        <span class="amount ${tx.type === 'income' ? 'income' : 'expense'}">${tx.amount.toFixed(2)} ${currency}</span>
                    `;
                    transactionsList.appendChild(txElement);
                });
            } else {
                transactionsList.innerHTML = '<p>لا توجد معاملات لعرضها.</p>';
            }
        }

        const totalBalance = totalIncome - totalExpense;

        const incomeCard = document.querySelector('.summary-cards .card.income p');
        const expenseCard = document.querySelector('.summary-cards .card.expenses p');
        const balanceCard = document.querySelector('.summary-cards .card.balance p');

        if(incomeCard) incomeCard.textContent = `${totalIncome.toFixed(2)} ${currency}`;
        if(expenseCard) expenseCard.textContent = `${totalExpense.toFixed(2)} ${currency}`;
        if(balanceCard) balanceCard.textContent = `${totalBalance.toFixed(2)} ${currency}`;
    }

    if (userSettings) {
        applyTheme(userSettings.theme);
        updateDashboard(userSettings, mockTransactions);
    } else {
        // Redirect to onboarding if no settings are found
        window.location.href = '../index.html';
    }
});