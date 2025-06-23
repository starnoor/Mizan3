document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const languageToggleButton = document.getElementById('language-toggle');

    // Function to apply theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else if (theme === 'light') {
            document.body.classList.remove('dark-mode');
        } else if (theme === 'auto') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    }

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    applyTheme(savedTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'auto') {
            applyTheme('auto');
        }
    });

    // Theme Toggle
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let currentTheme = localStorage.getItem('theme') || 'light';
            let newTheme;
            if (currentTheme === 'light') {
                newTheme = 'dark';
            } else if (currentTheme === 'dark') {
                newTheme = 'auto';
            } else {
                newTheme = 'light';
            }
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Function to apply language
    function applyLanguage(lang) {
        document.documentElement.lang = lang;
        if (lang === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
        // Here you would typically load and apply translations
        // For now, we just handle direction and lang attribute
    }

    // Apply saved language on load
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default to English
    applyLanguage(savedLanguage);

    // Language Toggle (if needed, though onboarding handles initial selection)
    if (languageToggleButton) {
        languageToggleButton.addEventListener('click', () => {
            let currentLang = localStorage.getItem('language') || 'en';
            let newLang = currentLang === 'en' ? 'ar' : 'en';
            localStorage.setItem('language', newLang);
            applyLanguage(newLang);
        });
    }

    // Feather icons replacement (moved here for centralization)
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Expose applyTheme and applyLanguage to global scope
    window.applyTheme = applyTheme;
    window.applyLanguage = applyLanguage;
});