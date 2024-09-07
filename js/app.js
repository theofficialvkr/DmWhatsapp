document.addEventListener('DOMContentLoaded', function () {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const sendMessageBtn = document.getElementById('sendMessage');
    const errorMessage = document.getElementById('error');
    const installAppBtn = document.getElementById('installApp');
    const messageInput = document.getElementById('message'); // Custom message input
    const countrySelect = document.getElementById('countrySelect'); // Dropdown for manual country selection
    let countryCode = ''; // Fetched country code
    let isCountryCodeFetched = false;

    // Load and cache country codes and phone lengths dynamically
    const countryPhoneLengths = {}; // Replace with real data for each country
    let countryDataLoaded = false;

    // Fetch country code dynamically using IP
    async function fetchCountryCode() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            countryCode = data.country_calling_code || ''; // Set the country calling code
            isCountryCodeFetched = true;
            if (countryCode) {
                countrySelect.value = countryCode;
            }
        } catch (error) {
            console.error("Country code fetch failed: ", error);
            displayError('Unable to determine country code. Please manually select your country.');
        }
    }

    fetchCountryCode();

    // Validate phone number based on country and length
    function validatePhoneNumber(phoneNumber) {
        const validLength = countryPhoneLengths[countryCode];
        return phoneNumber.length === validLength && /^\d+$/.test(phoneNumber);
    }

    // Prevent any non-digit input
    phoneNumberInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^\d]/g, ''); // Only allow digits
    });

    // Add event listener to send WhatsApp message
    sendMessageBtn.addEventListener('click', function () {
        const phoneNumber = phoneNumberInput.value.trim();
        const message = messageInput.value.trim();
        const fullPhoneNumber = countryCode + phoneNumber;

        if (!isCountryCodeFetched || !validatePhoneNumber(phoneNumber)) {
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
        installAppBtn.style.display = 'block';

        installAppBtn.addEventListener('click', () => {
            installAppBtn.style.display = 'none';
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
        console.log('PWA installed');
    });

    // Helper functions
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
});
