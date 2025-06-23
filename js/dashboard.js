document.addEventListener('DOMContentLoaded', () => {
    const totalIncomeElem = document.getElementById('total-income');
    const totalExpenseElem = document.getElementById('total-expense');
    const currentBalanceElem = document.getElementById('current-balance');
    const financialChartCanvas = document.getElementById('financial-chart');
    const dailyChartBtn = document.getElementById('daily-chart-btn');
    const monthlyChartBtn = document.getElementById('monthly-chart-btn');

    let financialChart;

    // Dummy Data (replace with actual data fetching in a real application)
    const dummyData = {
        income: 5000,
        expense: 2500,
        daily: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            income: [200, 300, 150, 400, 250, 500, 350],
            expense: [50, 100, 70, 120, 80, 150, 90]
        },
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            income: [2000, 2500, 2200, 3000, 2800, 3500, 3200, 3800, 4000, 4200, 4500, 5000],
            expense: [1000, 1200, 1100, 1500, 1400, 1700, 1600, 1900, 2000, 2100, 2300, 2500]
        }
    };

    function updateSummary() {
        totalIncomeElem.textContent = `$${dummyData.income.toFixed(2)}`;
        totalExpenseElem.textContent = `$${dummyData.expense.toFixed(2)}`;
        currentBalanceElem.textContent = `$${(dummyData.income - dummyData.expense).toFixed(2)}`;
    }

    function renderChart(type) {
        if (financialChart) {
            financialChart.destroy();
        }

        const data = type === 'daily' ? dummyData.daily : dummyData.monthly;

        financialChart = new Chart(financialChartCanvas, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: data.income,
                        borderColor: 'rgba(40, 167, 69, 1)',
                        backgroundColor: 'rgba(40, 167, 69, 0.2)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Expense',
                        data: data.expense,
                        borderColor: 'rgba(220, 53, 69, 1)',
                        backgroundColor: 'rgba(220, 53, 69, 0.2)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Initial load
    updateSummary();
    renderChart('monthly'); // Default to monthly view

    dailyChartBtn.addEventListener('click', () => renderChart('daily'));
    monthlyChartBtn.addEventListener('click', () => renderChart('monthly'));



    // Feather icons replacement
    feather.replace();
});