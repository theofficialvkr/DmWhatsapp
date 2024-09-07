document.addEventListener('DOMContentLoaded', function () {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const sendMessageBtn = document.getElementById('sendMessage');
    const errorMessage = document.getElementById('error');
    let countryCode = '+91'; // Default to India (can be dynamically fetched later)

    // Fetch country code dynamically using user's IP
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            countryCode = data.country_calling_code || '+91'; // Default to +91 if no country code found
        })
        .catch(() => {
            countryCode = '+91'; // If there's an error, fallback to +91
        });

    // Prevent any non-digit input
    phoneNumberInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
    });

    // Add an event listener for the "Send WhatsApp Message" button
    sendMessageBtn.addEventListener('click', function () {
        const phoneNumber = phoneNumberInput.value.trim();
        const fullPhoneNumber = countryCode + phoneNumber;
        
        // Validation: Ensure number only contains digits
        if (!/^\d+$/.test(phoneNumber)) {
            displayError('Please enter a valid mobile number (digits only).');
            return;
        }

        // Validation: Check phone number length based on country
        const validLength = countryPhoneLengths[countryCode];
        if (phoneNumber.length !== validLength) {
            displayError(`The mobile number for ${countryCode} must be ${validLength} digits long.`);
            return;
        }

        // If everything is valid, clear any error message
        clearError();

        // Open WhatsApp with the correct number
        const whatsappURL = `https://wa.me/${fullPhoneNumber}`;
        window.open(whatsappURL, '_blank');
    });

    // Helper function to display error messages
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        phoneNumberInput.classList.add('error'); // Optional: Add a CSS class for error highlighting
    }

    // Helper function to clear error messages
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        phoneNumberInput.classList.remove('error');
    }

    // Install app functionality (PWA)
    let deferredPrompt;
    const installAppBtn = document.getElementById('installApp');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing
        e.preventDefault();
        // Store the event so it can be triggered later
        deferredPrompt = e;
        // Show the install button
        installAppBtn.style.display = 'block';

        installAppBtn.addEventListener('click', () => {
            installAppBtn.style.display = 'none'; // Hide the button
            deferredPrompt.prompt(); // Show the install prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
    });
});
