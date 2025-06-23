document.addEventListener('DOMContentLoaded', () => {
    const goalForm = document.getElementById('goalForm');
    const goalsList = document.getElementById('goalsList');
    const userNameSpan = document.getElementById('userName');

    // Load user preferences (name) from localStorage
    const userName = localStorage.getItem('userName') || 'Guest';
    userNameSpan.textContent = userName;

    // Initialize Feather icons
    feather.replace();

    // Load goals from localStorage
    let goals = JSON.parse(localStorage.getItem('financialGoals')) || [];

    const saveGoals = () => {
        localStorage.setItem('financialGoals', JSON.stringify(goals));
    };

    const renderGoals = () => {
        goalsList.innerHTML = '';
        if (goals.length === 0) {
            goalsList.innerHTML = '<p style="text-align: center; width: 100%;">No financial goals set yet. Start by adding one above!</p>';
            return;
        }

        goals.forEach(goal => {
            const progress = (goal.savedAmount / goal.goalAmount) * 100;
            const progressBarWidth = Math.min(100, progress);
            const remainingAmount = goal.goalAmount - goal.savedAmount;

            let motivationMessage = '';
            if (progress >= 100) {
                motivationMessage = 'Congratulations! You\'ve reached your goal!';
            } else if (progress >= 75) {
                motivationMessage = 'Almost there! Keep pushing!';
            } else if (progress >= 50) {
                motivationMessage = 'Halfway point! You\'re doing great!';
            } else if (progress > 0) {
                motivationMessage = `You're on your way! Only ${remainingAmount.toFixed(2)} left.`;
            } else {
                motivationMessage = 'Start saving today to achieve your dreams!';
            }

            const goalCard = document.createElement('div');
            goalCard.classList.add('goal-card', 'glassmorphism');
            goalCard.innerHTML = `
                <h3>${goal.name}</h3>
                <p>Target: ${goal.goalAmount.toFixed(2)}</p>
                <p>Saved: ${goal.savedAmount.toFixed(2)}</p>
                ${goal.targetDate ? `<p>Target Date: ${goal.targetDate}</p>` : ''}
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progressBarWidth}%;">${progressBarWidth.toFixed(1)}%</div>
                </div>
                <p class="motivation-message">${motivationMessage}</p>
                <div class="actions">
                    <button data-id="${goal.id}" class="edit-goal"><i data-feather="edit"></i></button>
                    <button data-id="${goal.id}" class="delete-goal"><i data-feather="trash-2"></i></button>
                </div>
            `;
            goalsList.appendChild(goalCard);
        });
        feather.replace(); // Re-initialize icons for new elements
    };

    // Add new goal
    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('goalName').value;
        const amount = parseFloat(document.getElementById('goalAmount').value);
        const saved = parseFloat(document.getElementById('savedAmount').value) || 0;
        const targetDate = document.getElementById('goalDate').value;

        const newGoal = {
            id: Date.now(),
            name: name,
            goalAmount: amount,
            savedAmount: saved,
            targetDate: targetDate
        };
        goals.push(newGoal);
        saveGoals();
        renderGoals();
        goalForm.reset();
    });

    // Edit or Delete goal
    goalsList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-goal')) {
            const id = parseInt(e.target.closest('.delete-goal').dataset.id);
            goals = goals.filter(goal => goal.id !== id);
            saveGoals();
            renderGoals();
        } else if (e.target.closest('.edit-goal')) {
            const id = parseInt(e.target.closest('.edit-goal').dataset.id);
            const goalToEdit = goals.find(goal => goal.id === id);
            if (goalToEdit) {
                // For simplicity, we'll just prompt for new saved amount. A full modal would be better.
                const newSavedAmount = prompt(`Enter new saved amount for ${goalToEdit.name}:`, goalToEdit.savedAmount);
                if (newSavedAmount !== null) {
                    goalToEdit.savedAmount = parseFloat(newSavedAmount);
                    saveGoals();
                    renderGoals();
                }
            }
        }
    });

    renderGoals();
});