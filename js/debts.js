// Debt Tracker Logic
const debtForm = document.getElementById('debtForm');
const debtAmountInput = document.getElementById('debtAmount');
const debtorNameInput = document.getElementById('debtorName');
const creditorNameInput = document.getElementById('creditorName');
const dueDateInput = document.getElementById('dueDate');
const debtCategorySelect = document.getElementById('debtCategory');
const debtListDiv = document.getElementById('debtList');
const totalOwedToYouSpan = document.getElementById('totalOwedToYou');
const totalYouOweSpan = document.getElementById('totalYouOwe');

let debts = JSON.parse(localStorage.getItem('debts')) || [];

// Function to save debts to localStorage
function saveDebts() {
    localStorage.setItem('debts', JSON.stringify(debts));
}

// Function to render debts
function renderDebts() {
    debtListDiv.innerHTML = '';
    let totalOwedToYou = 0;
    let totalYouOwe = 0;

    if (debts.length === 0) {
        debtListDiv.innerHTML = '<p>No debts recorded yet.</p>';
    }

    debts.forEach((debt, index) => {
        const debtCard = document.createElement('div');
        debtCard.classList.add('debt-card');
        debtCard.innerHTML = `
            <h3>${debt.debtorName} owes ${debt.creditorName}</h3>
            <p>Amount: <strong>${debt.amount.toFixed(2)} SAR</strong></p>
            <p class="due-date">Due Date: ${debt.dueDate || 'N/A'}</p>
            <p class="category">Category: ${debt.category}</p>
            <div class="actions">
                <button class="btn edit-debt" data-index="${index}">Edit</button>
                <button class="btn delete-debt" data-index="${index}">Delete</button>
            </div>
        `;
        debtListDiv.appendChild(debtCard);

        if (debt.creditorName === localStorage.getItem('userName')) { // Assuming current user is the creditor
            totalOwedToYou += debt.amount;
        } else if (debt.debtorName === localStorage.getItem('userName')) { // Assuming current user is the debtor
            totalYouOwe += debt.amount;
        }
    });

    totalOwedToYouSpan.textContent = `${totalOwedToYou.toFixed(2)} SAR`;
    totalYouOweSpan.textContent = `${totalYouOwe.toFixed(2)} SAR`;

    initializeFeatherIcons(); // Re-initialize feather icons for new elements
}

// Function to add or edit a debt
debtForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const amount = parseFloat(debtAmountInput.value);
    const debtorName = debtorNameInput.value.trim();
    const creditorName = creditorNameInput.value.trim();
    const dueDate = dueDateInput.value;
    const category = debtCategorySelect.value;

    if (isNaN(amount) || amount <= 0 || debtorName === '' || creditorName === '') {
        alert('Please fill in all required fields with valid data.');
        return;
    }

    const newDebt = {
        amount,
        debtorName,
        creditorName,
        dueDate,
        category
    };

    const editingIndex = debtForm.dataset.editingIndex;
    if (editingIndex !== undefined) {
        debts[editingIndex] = newDebt;
        delete debtForm.dataset.editingIndex;
    } else {
        debts.push(newDebt);
    }

    saveDebts();
    renderDebts();
    debtForm.reset();
});

// Function to handle edit and delete actions
debtListDiv.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-debt')) {
        const index = event.target.dataset.index;
        const debtToEdit = debts[index];

        debtAmountInput.value = debtToEdit.amount;
        debtorNameInput.value = debtToEdit.debtorName;
        creditorNameInput.value = debtToEdit.creditorName;
        dueDateInput.value = debtToEdit.dueDate;
        debtCategorySelect.value = debtToEdit.category;

        debtForm.dataset.editingIndex = index; // Store index for editing

    } else if (event.target.classList.contains('delete-debt')) {
        const index = event.target.dataset.index;
        if (confirm('Are you sure you want to delete this debt record?')) {
            debts.splice(index, 1);
            saveDebts();
            renderDebts();
        }
    }
});

// Function to set up reminders (simplified for demonstration)
function setupDebtReminders() {
    const now = new Date();
    debts.forEach(debt => {
        if (debt.dueDate) {
            const dueDate = new Date(debt.dueDate);
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysDiff > 0 && daysDiff <= 7) { // Remind if due within 7 days
                console.log(`Reminder: Debt of ${debt.amount} SAR from ${debt.debtorName} to ${debt.creditorName} is due in ${daysDiff} days.`);
                // In a real application, this would trigger a notification (e.g., push notification, email, in-app alert)
                alert(`Reminder: Debt of ${debt.amount} SAR from ${debt.debtorName} to ${debt.creditorName} is due in ${daysDiff} days.`);
            }
        }
    });
}

// Initializations on page load
document.addEventListener('DOMContentLoaded', () => {
    renderDebts();
    setupDebtReminders();

    // Check for reminders daily (or more frequently if needed)
    setInterval(setupDebtReminders, 24 * 60 * 60 * 1000); // Every 24 hours
});