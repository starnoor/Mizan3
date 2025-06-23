document.addEventListener('DOMContentLoaded', () => {
    const budgetForm = document.getElementById('budgetForm');
    const budgetsList = document.getElementById('budgetsList');
    const userNameSpan = document.getElementById('userName');

    // Load user preferences (name, language, theme) from localStorage
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    if (userPreferences.name) {
        userNameSpan.textContent = userPreferences.name;
    }



    // Initialize Feather icons
    feather.replace();

    // Load budgets from localStorage
    let budgets = JSON.parse(localStorage.getItem('monthlyBudgets')) || [];

    // Dummy transactions for budget calculation (replace with actual transaction data later)
    const dummyTransactions = [
        { category: 'Food', amount: 50, type: 'expense', date: '2023-11-15' },
        { category: 'Transport', amount: 30, type: 'expense', date: '2023-11-10' },
        { category: 'Food', amount: 20, type: 'expense', date: '2023-11-20' },
        { category: 'Salary', amount: 1000, type: 'income', date: '2023-11-01' },
    ];

    const saveBudgets = () => {
        localStorage.setItem('monthlyBudgets', JSON.stringify(budgets));
    };

    const calculateCategorySpending = (category) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return dummyTransactions.reduce((total, transaction) => {
            const transactionDate = new Date(transaction.date);
            if (transaction.category === category && transaction.type === 'expense' &&
                transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                return total + transaction.amount;
            }
            return total;
        }, 0);
    };

    const renderBudgets = () => {
        budgetsList.innerHTML = '';
        if (budgets.length === 0) {
            budgetsList.innerHTML = '<p style="text-align: center; width: 100%;">No monthly budgets set yet. Start by adding one above!</p>';
            return;
        }

        budgets.forEach(budget => {
            const spent = calculateCategorySpending(budget.category);
            const remaining = budget.amount - spent;
            const usagePercentage = (spent / budget.amount) * 100;

            let progressBarClass = 'green';
            let alertMessage = '';

            if (usagePercentage >= 90) {
                progressBarClass = 'red';
                alertMessage = 'Warning: You are almost over budget!';
            } else if (usagePercentage >= 75) {
                progressBarClass = 'yellow';
                alertMessage = 'You are approaching your budget limit.';
            }

            const budgetCard = document.createElement('div');
            budgetCard.classList.add('budget-card', 'glassmorphism');
            budgetCard.innerHTML = `
                <h3>${budget.category}</h3>
                <p>Budget: ${budget.amount.toFixed(2)}</p>
                <p>Spent: ${spent.toFixed(2)}</p>
                <p>Remaining: ${remaining.toFixed(2)}</p>
                <div class="progress-container">
                    <div class="progress-bar ${progressBarClass}" style="width: ${Math.min(100, usagePercentage)}%;">${Math.min(100, usagePercentage).toFixed(1)}%</div>
                </div>
                ${alertMessage ? `<p class="alert-message">${alertMessage}</p>` : ''}
                <div class="actions">
                    <button data-id="${budget.id}" class="edit-budget"><i data-feather="edit"></i></button>
                    <button data-id="${budget.id}" class="delete-budget"><i data-feather="trash-2"></i></button>
                </div>
            `;
            budgetsList.appendChild(budgetCard);
        });
        feather.replace(); // Re-initialize icons for new elements
    };

    // Add new budget
    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('budgetCategroy').value;
        const amount = parseFloat(document.getElementById('budgetAmount').value);
        const carryOver = document.getElementById('carryOverBalance').checked;

        const newBudget = {
            id: Date.now(),
            category: category,
            amount: amount,
            carryOver: carryOver
        };
        budgets.push(newBudget);
        saveBudgets();
        renderBudgets();
        budgetForm.reset();
    });

    // Edit or Delete budget
    budgetsList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-budget')) {
            const id = parseInt(e.target.closest('.delete-budget').dataset.id);
            budgets = budgets.filter(budget => budget.id !== id);
            saveBudgets();
            renderBudgets();
        } else if (e.target.closest('.edit-budget')) {
            const id = parseInt(e.target.closest('.edit-budget').dataset.id);
            const budgetToEdit = budgets.find(budget => budget.id === id);
            if (budgetToEdit) {
                const newAmount = prompt(`Enter new budget amount for ${budgetToEdit.category}:`, budgetToEdit.amount);
                if (newAmount !== null) {
                    budgetToEdit.amount = parseFloat(newAmount);
                    saveBudgets();
                    renderBudgets();
                }
            }
        }
    });

    renderBudgets();
});