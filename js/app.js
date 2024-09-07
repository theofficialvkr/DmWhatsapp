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
    if (!countryCode.startsWith('+')) {
        countryCode = `+${countryCode}`;
    }
    phoneInput.placeholder = `Enter mobile number (${countryCode})`;
    currentCountryCode = countryCode;
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
        console.log(`Invalid country code: ${currentCountryCode}`);
        errorElement.textContent = 'Invalid country code.';
        return;
    }

    console.log(`Validating phone number: ${cleanPhoneNumber}, expected length: ${length}`);
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
