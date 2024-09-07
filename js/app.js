let deferredPrompt;

// Function to validate phone number based on country length
function validatePhoneNumber(phoneNumber, countryCode) {
    const phoneLength = countryPhoneLengths[countryCode];
    return phoneNumber.length === phoneLength;
}

// Get user location to auto-detect country code
fetch('https://ipapi.co/json')
    .then(response => response.json())
    .then(data => {
        const countryCode = data.country_calling_code;
        document.querySelector('#phoneNumber').placeholder = `Enter number (${countryCode})`;
    })
    .catch(() => {
        document.querySelector('#error').textContent = 'Unable to determine country code. Please check your input.';
    });

// WhatsApp message sending logic
document.querySelector('#sendMessage').addEventListener('click', () => {
    const phoneNumber = document.querySelector('#phoneNumber').value.trim();
    const countryCode = document.querySelector('#phoneNumber').placeholder.match(/(.*?)/)[1];

    if (!validatePhoneNumber(phoneNumber, countryCode)) {
        document.querySelector('#error').textContent = `Invalid phone number for ${countryCode}.`;
        return;
    }

    window.open(`https://wa.me/${countryCode.replace('+', '')}${phoneNumber}`, '_blank');
});

// Install the app
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.querySelector('#installApp').style.display = 'block';
});

document.querySelector('#installApp').addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
});
