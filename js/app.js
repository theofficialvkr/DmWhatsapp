const countryPhoneLengths = {
    '+1': 10, // USA, Canada
    '+20': 10, // Egypt
    '+30': 10, // Greece
    '+31': 9, // Netherlands
    '+32': 9, // Belgium
    '+33': 9, // France
    '+34': 9, // Spain
    '+36': 9, // Hungary
    '+39': 10, // Italy
    '+40': 10, // Romania
    '+41': 9, // Switzerland
    '+43': 10, // Austria
    '+44': 10, // United Kingdom
    '+45': 8, // Denmark
    '+46': 9, // Sweden
    '+47': 8, // Norway
    '+48': 9, // Poland
    '+49': 11, // Germany
    '+51': 9, // Peru
    '+52': 10, // Mexico
    '+53': 8, // Cuba
    '+54': 10, // Argentina
    '+55': 11, // Brazil
    '+56': 9, // Chile
    '+57': 10, // Colombia
    '+58': 10, // Venezuela
    '+60': 9, // Malaysia
    '+61': 9, // Australia
    '+62': 11, // Indonesia
    '+63': 10, // Philippines
    '+64': 9, // New Zealand
    '+65': 8, // Singapore
    '+66': 9, // Thailand
    '+81': 10, // Japan
    '+82': 11, // South Korea
    '+84': 9, // Vietnam
    '+86': 11, // China
    '+90': 10, // Turkey
    '+91': 10, // India
    '+92': 10, // Pakistan
    '+93': 9, // Afghanistan
    '+94': 10, // Sri Lanka
    '+95': 9, // Myanmar
    '+98': 10, // Iran
    '+211': 9, // South Sudan
    '+212': 9, // Morocco
    '+213': 9, // Algeria
    '+216': 8, // Tunisia
    '+218': 9, // Libya
    '+220': 8, // Gambia
    '+221': 9, // Senegal
    '+222': 9, // Mauritania
    '+223': 8, // Mali
    '+224': 9, // Guinea
    '+225': 8, // Ivory Coast
    '+226': 8, // Burkina Faso
    '+227': 8, // Niger
    '+228': 8, // Togo
    '+229': 8, // Benin
    '+230': 8, // Mauritius
    '+231': 8, // Liberia
    '+232': 8, // Sierra Leone
    '+233': 9, // Ghana
    '+234': 10, // Nigeria
    '+235': 8, // Chad
    '+236': 8, // Central African Republic
    '+237': 9, // Cameroon
    '+238': 7, // Cape Verde
    '+239': 7, // Sao Tome and Principe
    '+240': 9, // Equatorial Guinea
    '+241': 9, // Gabon
    '+242': 9, // Republic of the Congo
    '+243': 9, // Democratic Republic of the Congo
    '+244': 9, // Angola
    '+245': 9, // Guinea-Bissau
    '+248': 7, // Seychelles
    '+250': 9, // Rwanda
    '+251': 9, // Ethiopia
    '+252': 9, // Somalia
    '+253': 8, // Djibouti
    '+254': 9, // Kenya
    '+255': 9, // Tanzania
    '+256': 9, // Uganda
    '+257': 8, // Burundi
    '+258': 9, // Mozambique
    '+260': 9, // Zambia
    '+261': 9, // Madagascar
    '+262': 9, // Reunion
    '+263': 9, // Zimbabwe
    '+264': 9, // Namibia
    '+265': 9, // Malawi
    '+266': 8, // Lesotho
    '+267': 8, // Botswana
    '+268': 8, // Eswatini (Swaziland)
    '+269': 7, // Comoros
    '+290': 8, // Saint Helena
    '+291': 8, // Eritrea
    '+297': 7, // Aruba
    '+298': 6, // Faroe Islands
    '+299': 6, // Greenland
    '+350': 8, // Gibraltar
    '+351': 9, // Portugal
    '+352': 9, // Luxembourg
    '+353': 9, // Ireland
    '+354': 7, // Iceland
    '+355': 9, // Albania
    '+356': 8, // Malta
    '+357': 8, // Cyprus
    '+358': 9, // Finland
    '+359': 9, // Bulgaria
    '+370': 8, // Lithuania
    '+371': 8, // Latvia
    '+372': 8, // Estonia
    '+373': 8, // Moldova
    '+374': 8, // Armenia
    '+375': 9, // Belarus
    '+376': 6, // Andorra
    '+377': 8, // Monaco
    '+378': 9, // San Marino
    '+379': 8, // Vatican City
    '+380': 9, // Ukraine
    '+381': 9, // Serbia
    '+382': 8, // Montenegro
    '+383': 8, // Kosovo
    '+385': 9, // Croatia
    '+386': 9, // Slovenia
    '+387': 8, // Bosnia and Herzegovina
    '+389': 8, // North Macedonia
    '+420': 9, // Czech Republic
    '+421': 9, // Slovakia
    '+423': 7, // Liechtenstein
    '+501': 7, // Belize
    '+502': 8, // Guatemala
    '+503': 8, // El Salvador
    '+504': 8, // Honduras
    '+505': 8, // Nicaragua
    '+506': 8, // Costa Rica
    '+507': 8, // Panama
    '+508': 6, // Saint Pierre and Miquelon
    '+509': 8, // Haiti
    '+590': 9, // Guadeloupe
    '+591': 8, // Bolivia
    '+592': 7, // Guyana
    '+593': 9, // Ecuador
    '+594': 9, // French Guiana
    '+595': 9, // Paraguay
    '+596': 9, // Martinique
    '+597': 7, // Suriname
    '+598': 8, // Uruguay
    '+599': 7, // Curacao
    '+673': 7, // Brunei
    '+850': 10, // North Korea
    '+852': 8, // Hong Kong
    '+853': 8, // Macau
    '+855': 9, // Cambodia
    '+856': 9, // Laos
    '+880': 10, // Bangladesh
    '+886': 9, // Taiwan
    '+960': 7, // Maldives
    '+961': 8, // Lebanon
    '+962': 9, // Jordan
    '+963': 9, // Syria
    '+964': 10, // Iraq
    '+965': 8, // Kuwait
    '+966': 9, // Saudi Arabia
    '+967': 9, // Yemen
    '+968': 8, // Oman
    '+970': 9, // Palestine
    '+971': 9, // United Arab Emirates
    '+972': 9, // Israel
    '+973': 8, // Bahrain
    '+974': 8, // Qatar
    '+975': 8, // Bhutan
    '+976': 8, // Mongolia
    '+977': 10, // Nepal
    '+992': 9, // Tajikistan
    '+993': 8, // Turkmenistan
    '+994': 9, // Azerbaijan
    '+995': 9, // Georgia
    '+996': 9, // Kyrgyzstan
    '+998': 9, // Uzbekistan
};





const phoneInput = document.getElementById('phoneNumber');
const countrySelect = document.getElementById('countrySelect');
const sendMessageButton = document.getElementById('sendMessage');
const errorElement = document.getElementById('error');

// Store country code globally
let currentCountryCode = '+91'; // Default to India if no API response

// Fetch country dialing code from API
async function fetchCountryDialingCode() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return `+${data.country_calling_code}`;
    } catch (error) {
        console.error('Error fetching country dialing code:', error);
        return null;
    }
}

// Populate country select options
function populateCountrySelect() {
    const countries = Object.keys(countryPhoneLengths);
    countrySelect.innerHTML = countries.map(code => {
        return `<option value="${code}">${code} - ${countryPhoneLengths[code]} digits</option>`;
    }).join('');
    countrySelect.hidden = false;
}

// Update placeholder and global country code
function updatePlaceholderAndCountryCode(countryCode) {
    // Ensure only a single '+' sign
    const formattedCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
    phoneInput.placeholder = `Enter mobile number (${formattedCode})`;
    currentCountryCode = formattedCode;
}

// Validate and send WhatsApp message
function validateAndSendMessage() {
    const phoneNumber = phoneInput.value.trim();
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

    if (cleanPhoneNumber.length === 0) {
        errorElement.textContent = 'Phone number is required.';
        return;
    }

    const length = countryPhoneLengths[currentCountryCode];
    if (!length) {
        errorElement.textContent = 'Invalid country code.';
        return;
    }

    if (cleanPhoneNumber.length !== length) {
        errorElement.textContent = `Phone number must be ${length} digits long.`;
        return;
    }

    const whatsappURL = `https://wa.me/${currentCountryCode}${cleanPhoneNumber}`;
    window.open(whatsappURL, '_blank');
}

// Handle button click
sendMessageButton.addEventListener('click', () => {
    validateAndSendMessage();
});

// Initialize app
async function initializeApp() {
    const countryCode = await fetchCountryDialingCode();
    
    if (countryCode) {
        updatePlaceholderAndCountryCode(countryCode);
    } else {
        phoneInput.placeholder = 'Enter mobile number';
        populateCountrySelect();
        countrySelect.addEventListener('change', () => {
            updatePlaceholderAndCountryCode(countrySelect.value);
        });
    }
}

initializeApp();
