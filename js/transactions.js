document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const transactionsList = document.getElementById('transactions-list');
    const filterTextInput = document.getElementById('filter-text');
    const filterCategorySelect = document.getElementById('filter-category');
    const filterDateInput = document.getElementById('filter-date');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Function to render transactions
    function renderTransactions() {
        transactionsList.innerHTML = '';
        const filteredTransactions = transactions.filter(transaction => {
            const matchesText = filterTextInput.value === '' ||
                                transaction.description.toLowerCase().includes(filterTextInput.value.toLowerCase()) ||
                                transaction.tags.toLowerCase().includes(filterTextInput.value.toLowerCase());
            const matchesCategory = filterCategorySelect.value === 'all' ||
                                    transaction.category === filterCategorySelect.value;
            const matchesDate = filterDateInput.value === '' ||
                                transaction.date === filterDateInput.value;
            return matchesText && matchesCategory && matchesDate;
        });

        filteredTransactions.forEach(transaction => {
            const li = document.createElement('li');
            li.classList.add('transaction-item', transaction.type);
            li.dataset.id = transaction.id;
            li.innerHTML = `
                <div class="transaction-details">
                    <h3>${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)} (${transaction.category})</h3>
                    <p>${transaction.description} ${transaction.tags ? `(#${transaction.tags})` : ''}</p>
                    <p>${transaction.date} ${transaction.recurring !== 'none' ? `(Recurring: ${transaction.recurring})` : ''}</p>
                    ${transaction.attachments.image ? `<p>Image: <a href="${transaction.attachments.image}" target="_blank">View</a></p>` : ''}
                    ${transaction.attachments.audio ? `<p>Audio: <audio controls src="${transaction.attachments.audio}"></audio></p>` : ''}
                    ${transaction.attachments.location ? `<p>Location: <a href="https://www.google.com/maps/search/?api=1&query=${transaction.attachments.location.latitude},${transaction.attachments.location.longitude}" target="_blank">View on Map</a></p>` : ''}
                </div>
                <div class="transaction-actions">
                    <button class="edit" data-id="${transaction.id}">Edit</button>
                    <button class="delete" data-id="${transaction.id}">Delete</button>
                </div>
            `;
            transactionsList.appendChild(li);
        });
    }

    // Function to add/edit transaction
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = e.target.dataset.id || Date.now().toString();
        const type = document.getElementById('type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const tags = document.getElementById('tags').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;
        const recurring = document.getElementById('recurring').value;

        // Attachments (simplified for now)
        const attachments = {
            image: null, // To be implemented
            audio: null, // To be implemented
            location: null // To be implemented
        };

        const newTransaction = {
            id, type, amount, category, tags, date, description, recurring, attachments
        };

        if (e.target.dataset.id) {
            // Edit existing transaction
            transactions = transactions.map(t => t.id === id ? newTransaction : t);
            e.target.removeAttribute('data-id');
            document.querySelector('button[type="submit"]').textContent = 'Add Transaction';
        } else {
            // Add new transaction
            transactions.push(newTransaction);
        }

        localStorage.setItem('transactions', JSON.stringify(transactions));
        transactionForm.reset();
        renderTransactions();
    });

    // Edit and Delete functionality
    transactionsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const idToDelete = e.target.dataset.id;
            transactions = transactions.filter(t => t.id !== idToDelete);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            renderTransactions();
        } else if (e.target.classList.contains('edit')) {
            const idToEdit = e.target.dataset.id;
            const transactionToEdit = transactions.find(t => t.id === idToEdit);

            if (transactionToEdit) {
                document.getElementById('type').value = transactionToEdit.type;
                document.getElementById('amount').value = transactionToEdit.amount;
                document.getElementById('category').value = transactionToEdit.category;
                document.getElementById('tags').value = transactionToEdit.tags;
                document.getElementById('date').value = transactionToEdit.date;
                document.getElementById('description').value = transactionToEdit.description;
                document.getElementById('recurring').value = transactionToEdit.recurring;

                transactionForm.dataset.id = transactionToEdit.id; // Set ID for editing
                document.querySelector('button[type="submit"]').textContent = 'Update Transaction';
            }
        }
    });

    // Filtering
    filterTextInput.addEventListener('input', renderTransactions);
    filterCategorySelect.addEventListener('change', renderTransactions);
    filterDateInput.addEventListener('change', renderTransactions);

    // Attachment handlers (placeholders)
    document.getElementById('image-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // In a real app, you'd upload this to a server or store more efficiently
                // For now, we'll just store as a data URL (not recommended for large files)
                alert('Image selected (not fully implemented storage)');
                // Example: transaction.attachments.image = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('record-audio-btn').addEventListener('click', () => {
        alert('Audio recording not yet implemented.');
        // Implement MediaRecorder API for audio recording
    });

    document.getElementById('get-location-btn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                alert(`Location: ${position.coords.latitude}, ${position.coords.longitude} (not fully implemented storage)`);
                // Example: transaction.attachments.location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            }, (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve location.');
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });

    // Initial render
    renderTransactions();
});