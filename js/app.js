// Import the country phone lengths from the JS module
import countryPhoneLengths from 'js/countryPhoneLengths.js';

const phoneInput = document.getElementById('phoneNumber');
const sendButton = document.getElementById('sendMessage');
const installButton = document.getElementById('installApp');
const errorElement = document.getElementById('error');
let countryCodePlaceholder = '';

// Function to fetch and set the country code from the API
function fetchCountryCode() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data.country_calling_code) {
                countryCodePlaceholder = data.country_calling_code;
                phoneInput.placeholder = `Enter mobile number (${countryCodePlaceholder})`;
            } else {
                // Fallback to a default country code if the API response is missing the needed data
                countryCodePlaceholder = '+1'; // Default fallback code
                phoneInput.placeholder = `Enter mobile number (${countryCodePlaceholder})`;
            }
        })
        .catch(() => {
            // Handle API fetch error
            countryCodePlaceholder = '+1'; // Default fallback code
            phoneInput.placeholder = `Enter mobile number (${countryCodePlaceholder})`;
        });
}

// Function to validate the phone number length based on country code
function validatePhoneNumber(number) {
    const cleanedNumber = number.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const countryCode = cleanedNumber.startsWith('0') ? countryCodePlaceholder : '';

    if (countryPhoneLengths[countryCode]) {
        return cleanedNumber.length === countryPhoneLengths[countryCode];
    }

    return false;
}

// Function to handle sending WhatsApp messages
function sendMessage() {
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) {
        displayError('Please enter a mobile number.');
        return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
        displayError('Invalid phone number length for the detected country.');
        return;
    }

    const url = `https://wa.me/${countryCodePlaceholder}${phoneNumber}`;
    window.open(url, '_blank');
}

// Function to display error messages
function displayError(message) {
    errorElement.textContent = message;
}

// Function to handle app installation
let deferredPrompt;
installButton.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
});

// Event listeners
sendButton.addEventListener('click', sendMessage);

// Initialize
fetchCountryCode();
