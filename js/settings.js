document.addEventListener('DOMContentLoaded', () => {
    // Load settings on page load
    loadSettings();
    loadCustomCategoriesTags();

    // General Settings
    const appNameInput = document.getElementById('app-name');
    const languageSelect = document.getElementById('language');
    const currencySelect = document.getElementById('currency');
    const themeSelect = document.getElementById('theme');

    appNameInput.addEventListener('change', (e) => saveSetting('appName', e.target.value));
    languageSelect.addEventListener('change', (e) => {
        saveSetting('language', e.target.value);
        // Implement language change logic (e.g., reload page or update text dynamically)
        alert('Language changed. Please refresh the page to see full effect.');
    });
    currencySelect.addEventListener('change', (e) => saveSetting('defaultCurrency', e.target.value));
    themeSelect.addEventListener('change', (e) => {
        saveSetting('theme', e.target.value);
    });

    // Custom Categories and Tags
    const categoryColorInput = document.getElementById('category-color');
    const tagIconInput = document.getElementById('tag-icon');
    const addTagIconButton = document.getElementById('add-tag-icon');
    const customCategoriesTagsDiv = document.getElementById('custom-categories-tags');

    categoryColorInput.addEventListener('change', (e) => saveSetting('categoryColor', e.target.value));
    addTagIconButton.addEventListener('click', () => {
        const iconName = tagIconInput.value.trim();
        if (iconName) {
            addCustomTag(iconName);
            tagIconInput.value = '';
        }
    });

    // Data Export/Import
    const exportDataButton = document.getElementById('export-data');
    const importDataButton = document.getElementById('import-data');
    const importFileInput = document.getElementById('import-file');

    exportDataButton.addEventListener('click', exportData);
    importDataButton.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importData);

    // Full Reset
    const resetAppButton = document.getElementById('reset-app');
    resetAppButton.addEventListener('click', resetApplication);



    // Dummy developer info (replace with actual data if dynamic)
    const developerAvatar = document.querySelector('.developer-avatar');
    const poweredByText = document.querySelector('.footer p');
    developerAvatar.src = 'https://via.placeholder.com/60/4A90E2/FFFFFF?text=MEEMX'; // Placeholder image
    poweredByText.textContent = 'Powered by MEEMX © 2023';
});

function saveSetting(key, value) {
    localStorage.setItem(key, value);
}

function loadSettings() {
    document.getElementById('app-name').value = localStorage.getItem('appName') || 'MEEMX';
    document.getElementById('language').value = localStorage.getItem('language') || 'ar';
    document.getElementById('currency').value = localStorage.getItem('defaultCurrency') || 'SAR';
    document.getElementById('theme').value = localStorage.getItem('theme') || 'dark';
    document.getElementById('category-color').value = localStorage.getItem('categoryColor') || '#6200EE';
}



function loadCustomCategoriesTags() {
    const customTags = JSON.parse(localStorage.getItem('customTags')) || [];
    const customCategoriesTagsDiv = document.getElementById('custom-categories-tags');
    customCategoriesTagsDiv.innerHTML = '';
    customTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'custom-tag';
        tagElement.innerHTML = `<i data-feather="${tag}"></i> ${tag} <span class="delete-tag" data-tag="${tag}">x</span>`;
        customCategoriesTagsDiv.appendChild(tagElement);
    });


    document.querySelectorAll('.delete-tag').forEach(button => {
        button.addEventListener('click', (e) => {
            const tagToDelete = e.target.dataset.tag;
            removeCustomTag(tagToDelete);
        });
    });
}

function addCustomTag(tag) {
    const customTags = JSON.parse(localStorage.getItem('customTags')) || [];
    if (!customTags.includes(tag)) {
        customTags.push(tag);
        localStorage.setItem('customTags', JSON.stringify(customTags));
        loadCustomCategoriesTags();
    }
}

function removeCustomTag(tagToDelete) {
    let customTags = JSON.parse(localStorage.getItem('customTags')) || [];
    customTags = customTags.filter(tag => tag !== tagToDelete);
    localStorage.setItem('customTags', JSON.stringify(customTags));
    loadCustomCategoriesTags();
}

function exportData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    const dataStr = JSON.stringify(data, null, 4);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meemx_data_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Data exported successfully!');
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (confirm('Are you sure you want to import data? This will overwrite your current settings and data.')) {
                    for (const key in importedData) {
                        localStorage.setItem(key, importedData[key]);
                    }
                    alert('Data imported successfully! Please refresh the page.');
                    location.reload();
                }
            } catch (error) {
                alert('Failed to import data. Invalid JSON file.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }
}

function resetApplication() {
    if (confirm('Are you sure you want to reset the entire application? All your data will be permanently deleted.')) {
        localStorage.clear();
        alert('Application reset successfully! Reloading...');
        location.reload();
    }
}