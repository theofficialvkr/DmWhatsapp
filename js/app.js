// app.js

import countryPhoneLengths from 'js/countryPhoneLengths.js';

document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phoneNumber');
    const sendButton = document.getElementById('sendMessage');
    const errorMsg = document.getElementById('error');
    const countrySelect = document.getElementById('countrySelect');
    const installButton = document.getElementById('installApp');
    const selectCountryContainer = document.querySelector('.select-country-container');

    // Initialize country dialing codes
    let countryCode = '';

    // Populate country select options
    function populateCountrySelect() {
        Object.keys(countryPhoneLengths).forEach(code => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} ${getCountryName(code)}`;
            countrySelect.appendChild(option);
        });
    }

    function getCountryName(code) {
        // Mapping of country codes to country names (you may want to maintain a more complete list)
        const countryNames = {
            '+1': 'USA/Canada', '+20': 'Egypt', '+30': 'Greece', '+31': 'Netherlands', '+32': 'Belgium',
            '+33': 'France', '+34': 'Spain', '+36': 'Hungary', '+39': 'Italy', '+40': 'Romania',
            '+41': 'Switzerland', '+43': 'Austria', '+44': 'UK', '+45': 'Denmark', '+46': 'Sweden',
            '+47': 'Norway', '+48': 'Poland', '+49': 'Germany', '+51': 'Peru', '+52': 'Mexico',
            '+53': 'Cuba', '+54': 'Argentina', '+55': 'Brazil', '+56': 'Chile', '+57': 'Colombia',
            '+58': 'Venezuela', '+60': 'Malaysia', '+61': 'Australia', '+62': 'Indonesia', '+63': 'Philippines',
            '+64': 'New Zealand', '+65': 'Singapore', '+66': 'Thailand', '+81': 'Japan', '+82': 'South Korea',
            '+84': 'Vietnam', '+86': 'China', '+90': 'Turkey', '+91': 'India', '+92': 'Pakistan',
            '+93': 'Afghanistan', '+94': 'Sri Lanka', '+95': 'Myanmar', '+98': 'Iran', '+211': 'South Sudan',
            '+212': 'Morocco', '+213': 'Algeria', '+216': 'Tunisia', '+218': 'Libya', '+220': 'Gambia',
            '+221': 'Senegal', '+222': 'Mauritania', '+223': 'Mali', '+224': 'Guinea', '+225': 'Ivory Coast',
            '+226': 'Burkina Faso', '+227': 'Niger', '+228': 'Togo', '+229': 'Benin', '+230': 'Mauritius',
            '+231': 'Liberia', '+232': 'Sierra Leone', '+233': 'Ghana', '+234': 'Nigeria', '+235': 'Chad',
            '+236': 'CAR', '+237': 'Cameroon', '+238': 'Cape Verde', '+239': 'Sao Tome', '+240': 'Equatorial Guinea',
            '+241': 'Gabon', '+242': 'Republic of Congo', '+243': 'DR Congo', '+244': 'Angola', '+245': 'Guinea-Bissau',
            '+248': 'Seychelles', '+250': 'Rwanda', '+251': 'Ethiopia', '+252': 'Somalia', '+253': 'Djibouti',
            '+254': 'Kenya', '+255': 'Tanzania', '+256': 'Uganda', '+257': 'Burundi', '+258': 'Mozambique',
            '+260': 'Zambia', '+261': 'Madagascar', '+262': 'Reunion', '+263': 'Zimbabwe', '+264': 'Namibia',
            '+265': 'Malawi', '+266': 'Lesotho', '+267': 'Botswana', '+268': 'Eswatini', '+269': 'Comoros',
            '+290': 'Saint Helena', '+291': 'Eritrea', '+297': 'Aruba', '+298': 'Faroe Islands', '+299': 'Greenland',
            '+350': 'Gibraltar', '+351': 'Portugal', '+352': 'Luxembourg', '+353': 'Ireland', '+354': 'Iceland',
            '+355': 'Albania', '+356': 'Malta', '+357': 'Cyprus', '+358': 'Finland', '+359': 'Bulgaria',
            '+370': 'Lithuania', '+371': 'Latvia', '+372': 'Estonia', '+373': 'Moldova', '+374': 'Armenia',
            '+375': 'Belarus', '+376': 'Andorra', '+377': 'Monaco', '+378': 'San Marino', '+379': 'Vatican City',
            '+380': 'Ukraine', '+381': 'Serbia', '+382': 'Montenegro', '+383': 'Kosovo', '+385': 'Croatia',
            '+386': 'Slovenia', '+387': 'Bosnia and Herzegovina', '+389': 'North Macedonia', '+420': 'Czech Republic',
            '+421': 'Slovakia', '+423': 'Liechtenstein', '+501': 'Belize', '+502': 'Guatemala', '+503': 'El Salvador',
            '+504': 'Honduras', '+505': 'Nicaragua', '+506': 'Costa Rica', '+507': 'Panama', '+508': 'Saint Pierre and Miquelon',
            '+509': 'Haiti', '+590': 'Guadeloupe', '+591': 'Bolivia', '+592': 'Guyana', '+593': 'Ecuador',
            '+594': 'French Guiana', '+595': 'Paraguay', '+596': 'Martinique', '+597': 'Suriname', '+598': 'Uruguay',
            '+599': 'Curacao', '+673': 'Brunei', '+850': 'North Korea', '+852': 'Hong Kong', '+853': 'Macau',
            '+855': 'Cambodia', '+856': 'Laos', '+880': 'Bangladesh', '+886': 'Taiwan', '+960': 'Maldives',
            '+961': 'Lebanon', '+962': 'Jordan', '+963': 'Syria', '+964': 'Iraq', '+965': 'Kuwait',
            '+966': 'Saudi Arabia', '+967': 'Yemen', '+968': 'Oman', '+970': 'Palestine', '+971': 'UAE',
            '+972': 'Israel', '+973': 'Bahrain', '+974': 'Qatar', '+975': 'Bhutan', '+976': 'Mongolia',
            '+977': 'Nepal', '+992': 'Tajikistan', '+993': 'Turkmenistan', '+994': 'Azerbaijan', '+995': 'Georgia',
            '+996': 'Kyrgyzstan', '+998': 'Uzbekistan'
        };
        return countryNames[code] || 'Unknown';
    }

    // Initialize
    async function initialize() {
        try {
            const response = await fetch('https://ipapi.co/json');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            countryCode = data.country_calling_code;
            updatePlaceholder(countryCode);
            selectCountryContainer.classList.add('hidden');
        } catch (error) {
            console.error('Error fetching country code:', error);
            selectCountryContainer.classList.remove('hidden');
        }
    }

    function updatePlaceholder(code) {
        phoneInput.placeholder = `Enter Mobile Number (${code})`;
    }

    function validatePhoneNumber(number) {
        const cleanedNumber = number.replace(/\D/g, ''); // Remove non-numeric characters
        if (!countryCode) return false;
        const expectedLength = countryPhoneLengths[countryCode];
        return cleanedNumber.length === expectedLength;
    }

    function handleSendMessage() {
        const phoneNumber = phoneInput.value.trim();
        if (!validatePhoneNumber(phoneNumber)) {
            errorMsg.textContent = `Invalid number. Please enter a ${countryPhoneLengths[countryCode]}-digit number.`;
            return;
        }
        errorMsg.textContent = '';
        const formattedNumber = `${countryCode}${phoneNumber}`;
        window.open(`https://wa.me/${formattedNumber}`, '_blank');
    }

    function handleCountryChange() {
        countryCode = countrySelect.value;
        updatePlaceholder(countryCode);
        phoneInput.focus();
    }

    function handleInstallApp() {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            // Check if the app is already installed
            if (window.matchMedia('(display-mode: standalone)').matches) {
                alert('App is already installed.');
                return;
            }

            // Prompt the user to install the app
            if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                window.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt.');
                    } else {
                        console.log('User dismissed the A2HS prompt.');
                    }
                    window.deferredPrompt = null;
                });
            }
        } else {
            alert('Service workers are not supported.');
        }
    }

    // Event Listeners
    sendButton.addEventListener('click', handleSendMessage);
    countrySelect.addEventListener('change', handleCountryChange);
    installButton.addEventListener('click', handleInstallApp);

    // Initialize the application
    initialize();
});
