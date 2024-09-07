// Initialize the deferredPrompt variable for PWA install
let deferredPrompt;

// Function to validate phone number based on country length
function validatePhoneNumber(phoneNumber, countryCode) {
    const phoneLength = countryPhoneLengths[countryCode];
    if (!phoneLength) {
        console.error(`Country code ${countryCode} is not defined in phone length data.`);
        return false;
    }
    return phoneNumber.length === phoneLength;
}

// Restrict input to numbers only
document.querySelector('#phoneNumber').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, ''); // Replace any non-numeric characters
});

// Automatically insert country code and validate input on the fly
fetch('https://ipapi.co/json')
    .then(response => response.json())
    .then(data => {
        const countryCode = data.country_calling_code;
        if (countryCode) {
            const phoneNumberInput = document.querySelector('#phoneNumber');
            phoneNumberInput.value = countryCode; // Automatically insert country code
            phoneNumberInput.setAttribute('data-country-code', countryCode);
        } else {
            document.querySelector('#error').textContent = 'Unable to determine country code. Please check your input.';
        }
    })
    .catch(error => {
        console.error('Error fetching country data:', error);
        document.querySelector('#error').textContent = 'Unable to determine country code. Please check your input.';
    });

// WhatsApp message sending logic with validation
document.querySelector('#sendMessage').addEventListener('click', () => {
    const phoneNumberInput = document.querySelector('#phoneNumber');
    const fullPhoneNumber = phoneNumberInput.value.trim();
    const countryCode = phoneNumberInput.getAttribute('data-country-code');
    const phoneNumberWithoutCode = fullPhoneNumber.replace(countryCode, '').trim();

    // Validate the phone number based on country code
    if (!validatePhoneNumber(phoneNumberWithoutCode, countryCode)) {
        document.querySelector('#error').textContent = `Invalid phone number for ${countryCode}. Expected length: ${countryPhoneLengths[countryCode]}`;
        return;
    }

    // If validation passes, open WhatsApp chat
    window.open(`https://wa.me/${countryCode.replace('+', '')}${phoneNumberWithoutCode}`, '_blank');
});

// Real-time validation while typing
document.querySelector('#phoneNumber').addEventListener('input', () => {
    const phoneNumberInput = document.querySelector('#phoneNumber');
    const fullPhoneNumber = phoneNumberInput.value.trim();
    const countryCode = phoneNumberInput.getAttribute('data-country-code');
    const phoneNumberWithoutCode = fullPhoneNumber.replace(countryCode, '').trim();

    if (validatePhoneNumber(phoneNumberWithoutCode, countryCode)) {
        document.querySelector('#error').textContent = '';
        document.querySelector('#sendMessage').disabled = false;
    } else {
        document.querySelector('#error').textContent = `Invalid phone number for ${countryCode}. Expected length: ${countryPhoneLengths[countryCode]}`;
        document.querySelector('#sendMessage').disabled = true;
    }
});

// Handle the install prompt for PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.querySelector('#installApp').style.display = 'block';
});

document.querySelector('#installApp').addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
});
