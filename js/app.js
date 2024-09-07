import countryPhoneLengths from './countryPhoneLengths.js';

const phoneInput = document.getElementById('phoneNumber');
const countrySelect = document.getElementById('countrySelect');
const sendMessageButton = document.getElementById('sendMessage');
const errorElement = document.getElementById('error');

// Fetch country dialing codes
async function fetchCountryDialingCode() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.country_code;
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

// Validate and send WhatsApp message
function validateAndSendMessage() {
    const phoneNumber = phoneInput.value.trim();
    const selectedCountryCode = countrySelect.value || '';
    const countryCode = selectedCountryCode || '+91'; // Default code if country select is not visible

    // Remove any non-numeric characters from the phone number
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

    if (cleanPhoneNumber.length === 0) {
        errorElement.textContent = 'Phone number is required.';
        return;
    }

    const length = countryPhoneLengths[countryCode];
    if (!length) {
        errorElement.textContent = 'Invalid country code.';
        return;
    }

    if (cleanPhoneNumber.length !== length) {
        errorElement.textContent = `Phone number must be ${length} digits long.`;
        return;
    }

    const whatsappURL = `https://wa.me/${countryCode}${cleanPhoneNumber}`;
    window.open(whatsappURL, '_blank');
}

// Handle button click
sendMessageButton.addEventListener('click', () => {
    validateAndSendMessage();
});

// Initialize
async function initializeApp() {
    const countryCode = await fetchCountryDialingCode();

    if (countryCode) {
        const defaultCountryCode = `+${countryCode}`;
        phoneInput.placeholder = `Enter mobile number (${defaultCountryCode})`;
    } else {
        phoneInput.placeholder = 'Enter mobile number';
        populateCountrySelect();
    }
}

initializeApp();
