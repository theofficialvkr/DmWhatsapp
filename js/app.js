const phoneInput = document.getElementById('phoneNumber');
const sendButton = document.getElementById('sendMessage');
const installButton = document.getElementById('installApp');
const errorElement = document.getElementById('error');
const selectCountryContainer = document.getElementById('selectCountryContainer');
const countrySelect = document.getElementById('countrySelect');

let countryCode = '';
let countryLength = 10;

async function getCountryCode() {
    try {
        const response = await fetch('https://ipapi.co/json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        countryCode = data.country_calling_code;
        if (countryCode in countryPhoneLengths) {
            countryLength = countryPhoneLengths[countryCode];
            updatePlaceholder();
            selectCountryContainer.classList.add('hidden'); // Hide country select
        } else {
            throw new Error('Country code not found in lengths');
        }
    } catch (error) {
        console.error('Error fetching country code:', error);
        countryCode = '';
        countryLength = 10;
        showSelectCountry(); // Show country select
    }
}

function updatePlaceholder() {
    phoneInput.placeholder = `Enter mobile number (${countryCode})`;
}

function handleSendMessage() {
    let phoneNumber = phoneInput.value.trim();
    if (!phoneNumber) {
        errorElement.textContent = 'Please enter a mobile number.';
        errorElement.classList.remove('hidden');
        return;
    }

    // Add country code if not present
    if (countryCode && !phoneNumber.startsWith(countryCode)) {
        phoneNumber = countryCode + phoneNumber;
    }

    // Validate the phone number length
    if (phoneNumber.length !== countryLength) {
        errorElement.textContent = `Please enter a valid number with ${countryLength} digits.`;
        errorElement.classList.remove('hidden');
        return;
    }

    // Open WhatsApp with the phone number
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
    errorElement.classList.add('hidden');
}

function showSelectCountry() {
    selectCountryContainer.classList.remove('hidden'); // Show the country select input
}

function populateCountrySelect() {
    Object.keys(countryPhoneLengths).forEach(code => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} (${countryPhoneLengths[code]} digits)`;
        countrySelect.appendChild(option);
    });
}

countrySelect.addEventListener('change', (event) => {
    countryCode = event.target.value;
    countryLength = countryPhoneLengths[countryCode] || 10;
    updatePlaceholder();
    selectCountryContainer.classList.add('hidden'); // Hide the country select input
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.classList.remove('hidden');
});

installButton.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    }
});

sendButton.addEventListener('click', handleSendMessage);

populateCountrySelect();
getCountryCode();
