document.addEventListener('DOMContentLoaded', function () {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const sendMessageBtn = document.getElementById('sendMessage');
    const errorMessage = document.getElementById('error');
    const installAppBtn = document.getElementById('installApp');
    const messageInput = document.getElementById('message');
    const countrySelect = document.getElementById('countrySelect');
    let countryCode = ''; // Fetched country code
    let countryPhoneLengths = {}; // Country phone lengths map

    // Fetch country code and phone lengths
    async function fetchCountryData() {
        try {
            // Fetch country phone lengths from a static or dynamic source
            countryPhoneLengths = await fetch('/path/to/countryPhoneLengths.json').then(response => response.json());

            // Fetch country code using IP API
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            countryCode = data.country_calling_code || '';
            populateCountrySelect();
            setDefaultCountry();
        } catch (error) {
            console.error("Failed to fetch country data: ", error);
            displayError('Unable to determine country code. Please manually select your country.');
        }
    }

    // Populate country select dropdown
    function populateCountrySelect() {
        for (const [code, length] of Object.entries(countryPhoneLengths)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `Country (${code})`; // Replace with actual country names
            countrySelect.appendChild(option);
        }
    }

    // Set default country selection if country code is known
    function setDefaultCountry() {
        if (countryCode) {
            countrySelect.value = countryCode;
        }
    }

    // Validate phone number based on country code
    function validatePhoneNumber(phoneNumber) {
        const validLength = countryPhoneLengths[countryCode];
        return phoneNumber.length === validLength && /^\d+$/.test(phoneNumber);
    }

    // Add event listener to send WhatsApp message
    sendMessageBtn.addEventListener('click', function () {
        const phoneNumber = phoneNumberInput.value.trim();
        const message = messageInput.value.trim();
        const selectedCountryCode = countrySelect.value || countryCode;
        const fullPhoneNumber = selectedCountryCode + phoneNumber;

        if (!validatePhoneNumber(phoneNumber)) {
            displayError('Please enter a valid mobile number.');
            return;
        }

        // Clear any error messages
        clearError();

        // Prepare WhatsApp URL with optional message
        const whatsappURL = `https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    });

    // Install app functionality
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installAppBtn.classList.add('show');

        installAppBtn.addEventListener('click', () => {
            installAppBtn.classList.remove('show');
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User installed the app');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    });

    window.addEventListener('appinstalled', () => {
        console.log('App successfully installed');
    });

    // Display error message
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Clear error message
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }

    // Initialize
    fetchCountryData();
});
