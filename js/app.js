const countryPhoneLengths = {
    // Country codes and their phone number lengths
    '+1': 10, '+20': 10, '+30': 10, '+31': 9, '+32': 9, '+33': 9, '+34': 9, '+36': 9, '+39': 10, 
    '+40': 10, '+41': 9, '+43': 10, '+44': 10, '+45': 8, '+46': 9, '+47': 8, '+48': 9, '+49': 11, 
    '+51': 9, '+52': 10, '+53': 8, '+54': 10, '+55': 11, '+56': 9, '+57': 10, '+58': 10, '+60': 9,
    '+61': 9, '+62': 11, '+63': 10, '+64': 9, '+65': 8, '+66': 9, '+81': 10, '+82': 11, '+84': 9, 
    '+86': 11, '+90': 10, '+91': 10, '+92': 10, '+93': 9, '+94': 10, '+95': 9, '+98': 10, '+211': 9,
    '+212': 9, '+213': 9, '+216': 8, '+218': 9, '+220': 8, '+221': 9, '+222': 9, '+223': 8, '+224': 9,
    '+225': 8, '+226': 8, '+227': 8, '+228': 8, '+229': 8, '+230': 8, '+231': 8, '+232': 8, '+233': 9,
    '+234': 10, '+235': 8, '+236': 8, '+237': 9, '+238': 7, '+239': 7, '+240': 9, '+241': 9, '+242': 9, 
    '+243': 9, '+244': 9, '+245': 9, '+248': 7, '+250': 9, '+251': 9, '+252': 9, '+253': 8, '+254': 9,
    '+255': 9, '+256': 9, '+257': 8, '+258': 9, '+260': 9, '+261': 9, '+262': 9, '+263': 9, '+264': 9,
    '+265': 9, '+266': 8, '+267': 8, '+268': 8, '+269': 7, '+290': 8, '+291': 8, '+297': 7, '+298': 6,
    '+299': 6, '+350': 8, '+351': 9, '+352': 9, '+353': 9, '+354': 7, '+355': 9, '+356': 8, '+357': 8,
    '+358': 9, '+359': 9, '+370': 8, '+371': 8, '+372': 8, '+373': 8, '+374': 8, '+375': 9, '+376': 6,
    '+377': 8, '+378': 9, '+379': 8, '+380': 9, '+381': 9, '+382': 8, '+383': 8, '+385': 9, '+386': 9,
    '+387': 8, '+389': 8, '+420': 9, '+421': 9, '+423': 7, '+501': 7, '+502': 8, '+503': 8, '+504': 8,
    '+505': 8, '+506': 8, '+507': 8, '+508': 6, '+509': 8, '+590': 9, '+591': 8, '+592': 7, '+593': 9,
    '+594': 9, '+595': 9, '+596': 9, '+597': 7, '+598': 8, '+599': 7, '+673': 7, '+850': 10, '+852': 8,
    '+853': 8, '+855': 9, '+856': 9, '+880': 10, '+886': 9, '+960': 7, '+961': 8, '+962': 9, '+963': 9,
    '+964': 10, '+965': 8, '+966': 9, '+967': 9, '+968': 8, '+970': 9, '+971': 9, '+972': 9, '+973': 8,
    '+974': 8, '+975': 8, '+976': 8, '+977': 10, '+992': 9, '+993': 8, '+994': 9, '+995': 9, '+996': 9,
    '+998': 9
};

const phoneInput = document.getElementById('phoneNumber');
const countrySelect = document.getElementById('countrySelect');
const sendMessageButton = document.getElementById('sendMessage');
const errorElement = document.getElementById('error');

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
    // Remove any leading '+' characters and re-add a single one
    countryCode = `+${countryCode.replace(/\++/g, '')}`;
    phoneInput.placeholder = `Enter mobile number (${countryCode})`;
    currentCountryCode = countryCode;
}

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
