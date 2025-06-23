document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('DOMContentLoaded', () => {
    const onboardingForm = document.getElementById('onboarding-form');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const countrySelect = document.getElementById('country');
    const currencySelect = document.getElementById('currency');
    const languageSelect = document.getElementById('language');
    const themeSelect = document.getElementById('theme');
    const selectedFlag = document.getElementById('selected-flag');

    let currentStep = 1;
    const totalSteps = 5;

    const countries = [
        { code: 'SA', name: 'Saudi Arabia', name_ar: 'المملكة العربية السعودية', currency: 'SAR', flag: '🇸🇦' },
        { code: 'US', name: 'United States', name_ar: 'الولايات المتحدة', currency: 'USD', flag: '🇺🇸' },
        { code: 'GB', name: 'United Kingdom', name_ar: 'المملكة المتحدة', currency: 'GBP', flag: '🇬🇧' },
        { code: 'AE', name: 'United Arab Emirates', name_ar: 'الإمارات العربية المتحدة', currency: 'AED', flag: '🇦🇪' },
        { code: 'EG', name: 'Egypt', name_ar: 'مصر', currency: 'EGP', flag: '🇪🇬' },
        { code: 'KW', name: 'Kuwait', name_ar: 'الكويت', currency: 'KWD', flag: '🇰🇼' },
        { code: 'QA', name: 'Qatar', name_ar: 'قطر', currency: 'QAR', flag: '🇶🇦' },
        { code: 'BH', name: 'Bahrain', name_ar: 'البحرين', currency: 'BHD', flag: '🇧🇭' },
        { code: 'OM', name: 'Oman', name_ar: 'عمان', currency: 'OMR', flag: '🇴🇲' },
        { code: 'JO', name: 'Jordan', name_ar: 'الأردن', currency: 'JOD', flag: '🇯🇴' },
        { code: 'LB', name: 'Lebanon', name_ar: 'لبنان', currency: 'LBP', flag: '🇱🇧' },
        { code: 'DE', name: 'Germany', name_ar: 'ألمانيا', currency: 'EUR', flag: '🇩🇪' },
        { code: 'FR', name: 'France', name_ar: 'فرنسا', currency: 'EUR', flag: '🇫🇷' },
        { code: 'CA', name: 'Canada', name_ar: 'كندا', currency: 'CAD', flag: '🇨🇦' },
        { code: 'AU', name: 'Australia', name_ar: 'أستراليا', currency: 'AUD', flag: '🇦🇺' },
        { code: 'IN', name: 'India', name_ar: 'الهند', currency: 'INR', flag: '🇮🇳' },
        { code: 'CN', name: 'China', name_ar: 'الصين', currency: 'CNY', flag: '🇨🇳' },
        { code: 'JP', name: 'Japan', name_ar: 'اليابان', currency: 'JPY', flag: '🇯🇵' },
        { code: 'IQ', name: 'Iraq', name_ar: 'العراق', currency: 'IQD', flag: '🇮🇶' }
    ];

    const currencies = [
        { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', name_ar: 'الريال السعودي' },
        { code: 'USD', name: 'US Dollar', symbol: '$', name_ar: 'الدولار الأمريكي' },
        { code: 'EUR', name: 'Euro', symbol: '€', name_ar: 'اليورو' },
        { code: 'GBP', name: 'British Pound', symbol: '£', name_ar: 'الجنيه الإسترليني' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', name_ar: 'الدرهم الإماراتي' },
        { code: 'EGP', name: 'Egyptian Pound', symbol: 'ج.م', name_ar: 'الجنيه المصري' },
        { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', name_ar: 'الدينار الكويتي' },
        { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', name_ar: 'الريال القطري' },
        { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', name_ar: 'الدينار البحريني' },
        { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', name_ar: 'الريال العماني' },
        { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', name_ar: 'الدينار الأردني' },
        { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', name_ar: 'الليرة اللبنانية' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', name_ar: 'الدولار الكندي' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', name_ar: 'الدولار الأسترالي' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', name_ar: 'الروبية الهندية' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', name_ar: 'اليوان الصيني' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', name_ar: 'الين الياباني' },
        { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', name_ar: 'الدينار العراقي' }
    ];

    function populateCountries() {
        countrySelect.innerHTML = '';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = `${country.flag} ${languageSelect.value === 'ar' ? country.name_ar : country.name}`;
            countrySelect.appendChild(option);
        });
        // Set default country to Iraq if available, otherwise first country
        const defaultCountry = countries.find(c => c.code === 'IQ') || countries[0];
        if (defaultCountry) {
            countrySelect.value = defaultCountry.code;
            updateFlag(defaultCountry.code);
            populateCurrencies(defaultCountry.currency);
        }
    }

    function updateFlag(countryCode) {
        const country = countries.find(c => c.code === countryCode);
        if (country) {
            selectedFlag.textContent = country.flag;
        } else {
            selectedFlag.textContent = '';
        }
    }

    function populateCurrencies(suggestedCurrencyCode = null) {
        currencySelect.innerHTML = '';
        const sortedCurrencies = [...currencies].sort((a, b) => {
            if (a.code === suggestedCurrencyCode) return -1;
            if (b.code === suggestedCurrencyCode) return 1;
            return (languageSelect.value === 'ar' ? a.name_ar : a.name).localeCompare(languageSelect.value === 'ar' ? b.name_ar : b.name);
        });

        sortedCurrencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${languageSelect.value === 'ar' ? currency.name_ar : currency.name} (${currency.symbol})`;
            currencySelect.appendChild(option);
        });

        if (suggestedCurrencyCode) {
            currencySelect.value = suggestedCurrencyCode;
        }
    }

    function showStep(step) {
        document.querySelectorAll('.step-content').forEach(div => {
            div.classList.remove('active');
        });
        document.querySelector(`[data-step="${step}"]`).classList.add('active');
        updateProgressBar(step);
        updateNavigationButtons(step);
    }

    function updateProgressBar(step) {
        const progress = (step / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function updateNavigationButtons(step) {
        prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
        nextBtn.style.display = step === totalSteps ? 'none' : 'inline-block';
        submitBtn.style.display = step === totalSteps ? 'inline-block' : 'none';
    }

    function applyLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        // Re-populate selects to update text based on new language
        populateCountries();
        const selectedCountryCode = countrySelect.value;
        const country = countries.find(c => c.code === selectedCountryCode);
        if (country) {
            populateCurrencies(country.currency);
        } else {
            populateCurrencies();
        }
        updateContentLanguage(lang);
    }

    function updateContentLanguage(lang) {
        const elements = {
            'Welcome to Mizan!': { ar: 'أهلاً بك في ميزان!', en: 'Welcome to Mizan!' },
            'First Name:': { ar: 'الاسم الأول:', en: 'First Name:' },
            'Enter your first name': { ar: 'أدخل اسمك الأول', en: 'Enter your first name' },
            'Last Name:': { ar: 'الاسم الأخير:', en: 'Last Name:' },
            'Enter your last name': { ar: 'أدخل اسمك الأخير', en: 'Enter your last name' },
            'Country:': { ar: 'الدولة:', en: 'Country:' },
            'Base Currency:': { ar: 'العملة الأساسية:', en: 'Base Currency:' },
            'Language:': { ar: 'اللغة:', en: 'Language:' },
            'Theme:': { ar: 'المظهر:', en: 'Theme:' },
            'Light': { ar: 'فاتح', en: 'Light' },
            'Dark': { ar: 'داكن', en: 'Dark' },
            'Auto': { ar: 'تلقائي', en: 'Auto' },
            'Previous': { ar: 'السابق', en: 'Previous' },
            'Next': { ar: 'التالي', en: 'Next' },
            'Start Now': { ar: 'ابدأ الآن', en: 'Start Now' }
        };

        for (const key in elements) {
            const originalText = key;
            const translatedText = elements[key][lang];
            document.querySelectorAll('label').forEach(label => {
                if (label.textContent.trim() === originalText) {
                    label.textContent = translatedText;
                }
            });
            document.querySelectorAll('h1').forEach(h1 => {
                if (h1.textContent.trim() === originalText) {
                    h1.textContent = translatedText;
                }
            });
            document.querySelectorAll('input[type="text"]').forEach(input => {
                if (input.placeholder.trim() === originalText) {
                    input.placeholder = translatedText;
                }
            });
            document.querySelectorAll('button').forEach(button => {
                if (button.textContent.trim() === originalText) {
                    button.textContent = translatedText;
                }
            });
        }
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    nextBtn.addEventListener('click', () => {
        // Basic validation for current step before moving to next
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let allValid = true;
        inputs.forEach(input => {
            if (!input.value) {
                allValid = false;
                input.focus();
            }
        });

        if (allValid && currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });

    countrySelect.addEventListener('change', () => {
        const selectedCountryCode = countrySelect.value;
        updateFlag(selectedCountryCode);
        const country = countries.find(c => c.code === selectedCountryCode);
        if (country) {
            populateCurrencies(country.currency);
        }
    });

    languageSelect.addEventListener('change', () => {
        applyLanguage(languageSelect.value);
    });

    themeSelect.addEventListener('change', () => {
        // This will be handled by theme-language.js
        localStorage.setItem('theme', themeSelect.value);
        // Assuming theme-language.js has a function to apply theme
        if (typeof applyTheme === 'function') {
            applyTheme();
        }
    });

    onboardingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const userData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            country: countrySelect.value,
            currency: currencySelect.value,
            language: languageSelect.value,
            theme: themeSelect.value
        };

        localStorage.setItem('mizanUserData', JSON.stringify(userData));
        window.location.href = 'index.html';
    });

    // Initial setup
    populateCountries();
    applyLanguage(languageSelect.value);
    showStep(currentStep);
});