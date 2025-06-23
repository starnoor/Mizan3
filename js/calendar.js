document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYearHeader = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const selectedDateSpan = document.getElementById('selectedDate');
    const dailyTransactionsList = document.getElementById('dailyTransactionsList');
    const userNameSpan = document.getElementById('userName');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Load user preferences (name, language, theme) from localStorage
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    if (userPreferences.name) {
        userNameSpan.textContent = userPreferences.name;
    }



    // Initialize Feather icons
    feather.replace();

    // Dummy transactions for demonstration. In a real app, this would come from transactions.js or a backend.
    const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const getDailySpending = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return allTransactions.reduce((total, transaction) => {
            if (transaction.date === dateString && transaction.type === 'expense') {
                return total + transaction.amount;
            }
            return total;
        }, 0);
    };

    const getHeatmapClass = (spending) => {
        if (spending === 0) return 'heatmap-0';
        if (spending < 50) return 'heatmap-1';
        if (spending < 150) return 'heatmap-2';
        return 'heatmap-3';
    };

    const renderCalendar = () => {
        calendarGrid.innerHTML = '';
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

        const monthNames = userPreferences.language === 'ar' ?
            ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"] :
            ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = userPreferences.language === 'ar' ?
            ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] :
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        currentMonthYearHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Render day names
        dayNames.forEach(day => {
            const dayNameDiv = document.createElement('div');
            dayNameDiv.classList.add('day-name');
            dayNameDiv.textContent = day;
            calendarGrid.appendChild(dayNameDiv);
        });

        // Render empty days for the start of the month
        for (let i = 0; i < startDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-day');
            calendarGrid.appendChild(emptyDiv);
        }

        // Render days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = i;
            const date = new Date(currentYear, currentMonth, i);
            dayDiv.dataset.date = date.toISOString().split('T')[0];

            const dailySpending = getDailySpending(date);
            dayDiv.classList.add(getHeatmapClass(dailySpending));

            dayDiv.addEventListener('click', () => {
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                dayDiv.classList.add('selected');
                displayDailyTransactions(dayDiv.dataset.date);
            });
            calendarGrid.appendChild(dayDiv);
        }
    };

    const displayDailyTransactions = (dateString) => {
        selectedDateSpan.textContent = dateString;
        dailyTransactionsList.innerHTML = '';

        const transactionsOnDate = allTransactions.filter(t => t.date === dateString);

        if (transactionsOnDate.length === 0) {
            dailyTransactionsList.innerHTML = '<p>No transactions for this day.</p>';
            return;
        }

        transactionsOnDate.forEach(transaction => {
            const transactionDiv = document.createElement('div');
            transactionDiv.classList.add('transaction-item');
            transactionDiv.innerHTML = `
                <span>${transaction.description || transaction.category}</span>
                <span class="amount ${transaction.type}">${transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}</span>
            `;
            dailyTransactionsList.appendChild(transactionDiv);
        });
    };

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar();
});