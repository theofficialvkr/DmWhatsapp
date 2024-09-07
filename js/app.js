document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phoneNumber');
    const sendMessageBtn = document.getElementById('sendMessage');
    const installAppBtn = document.getElementById('installApp');
    const errorMessage = document.getElementById('error');
    const countryCodePlaceholder = '+1'; // Default placeholder
    let countryPhoneLengths = {}; // Will be loaded dynamically

    // Function to fetch country phone lengths from a JSON file
    function fetchCountryData() {
        fetch('/js/countryPhoneLengths.js')
            .then(response => response.json())
            .then(data => {
                countryPhoneLengths = data;
                // Update the placeholder with the default country code
                phoneInput.placeholder = `Enter mobile number (${countryCodePlaceholder})`;
            })
            .catch(() => {
                displayError('Unable to fetch country phone lengths. Please try again later.');
            });
    }

    // Function to fetch country code based on IP
    function fetchCountryCode() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                if (data.country_code && data.country_calling_code) {
                    countryCodePlaceholder = data.country_calling_code;
                    phoneInput.placeholder = `Enter mobile number (${countryCodePlaceholder})`;
                } else {
                    phoneCodePlaceholder = '+1'; // Fallback to default if API fails
                    phoneInput.placeholder = `Enter mobile number (${countryCodePlaceholder})`;
                }
            })
            .catch(() => {
                phoneCodePlaceholder = '+1'; // Fallback to default
                phoneInput.placeholder = `Enter mobile number (${countryCodePlaceholder})`;
            });
    }

    // Function to validate the phone number
    function validatePhoneNumber(number) {
        const cleanedNumber = number.replace(/[^0-9]/g, ''); // Remove non-digit characters
        const length = countryPhoneLengths[countryCodePlaceholder];
        if (cleanedNumber.length !== length) {
            displayError(`Please enter a ${length}-digit phone number.`);
            return false;
        }
        return true;
    }

    // Function to display an error message
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Function to clear the error message
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }

    // Event handler for the send message button
    sendMessageBtn.addEventListener('click', () => {
        const phoneNumber = phoneInput.value.trim();
        clearError();
        if (validatePhoneNumber(phoneNumber)) {
            const fullNumber = `${countryCodePlaceholder}${phoneNumber}`;
            window.open(`https://wa.me/${fullNumber}`, '_blank');
        }
    });

    // Event handler for the install app button
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installAppBtn.style.display = 'block';
    });

    installAppBtn.addEventListener('click', () => {
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

    // Check if the app is installed and hide the install button if true
    if (window.matchMedia('(display-mode: standalone)').matches) {
        installAppBtn.style.display = 'none';
    }

    // Initialize
    fetchCountryCode();
    fetchCountryData();
});
