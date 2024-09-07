// Initialize the deferredPrompt variable
let deferredPrompt;

// Function to validate phone number based on country length
function validatePhoneNumber(phoneNumber, countryCode) {
    const phoneLength = countryPhoneLengths[countryCode];
    if (phoneLength === undefined) {
        console.error(`Country code ${countryCode} is not defined in phone length data.`);
        return false;
    }
    return phoneNumber.length === phoneLength;
}

// Get user location to auto-detect country code
fetch('https://ipapi.co/json')
    .then(response => response.json())
    .then(data => {
        const countryCode = data.country_calling_code;
        if (countryCode) {
            document.querySelector('#phoneNumber').placeholder = `Enter number (${countryCode})`;
        } else {
            document.querySelector('#error').textContent = 'Unable to determine country code. Please check your input.';
        }
    })
    .catch(error => {
        console.error('Error fetching country data:', error);
        document.querySelector('#error').textContent = 'Unable to determine country code. Please check your input.';
    });

// WhatsApp message sending logic
document.querySelector('#sendMessage').addEventListener('click', () => {
    const phoneNumber = document.querySelector('#phoneNumber').value.trim();
    const placeholderText = document.querySelector('#phoneNumber').placeholder;
    const countryCodeMatch = placeholderText.match(/(.*?)/);
    
    if (!countryCodeMatch) {
        document.querySelector('#error').textContent = 'Country code is missing in placeholder.';
        return;
    }

    const countryCode = countryCodeMatch[1];

    if (!validatePhoneNumber(phoneNumber, countryCode)) {
        document.querySelector('#error').textContent = `Invalid phone number for ${countryCode}. Expected length: ${countryPhoneLengths[countryCode]}`;
        return;
    }

    // Open WhatsApp chat in a new tab
    window.open(`https://wa.me/${countryCode.replace('+', '')}${phoneNumber}`, '_blank');
});

// Handle the install prompt
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
            document.querySelector('#installApp').style.display = 'none';
        });
    } else {
        console.warn('Install prompt is not available.');
    }
});
