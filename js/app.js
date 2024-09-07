document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('phone');
    const sendButton = document.getElementById('sendMessage');
    const countrySelect = document.getElementById('country');
    const errorDiv = document.getElementById('error');
    const installButton = document.getElementById('installApp');
    const selectCountryContainer = document.querySelector('.select-country-container');

    let countryCode = '';
    let phoneLengths = {};

    // Fetch country phone lengths
    fetch('/js/countryPhoneLengths.js')
        .then(response => response.text())
        .then(script => {
            // Evaluate the script to get the phone lengths
            const phoneLengthsScript = new Function('return ' + script)();
            phoneLengths = phoneLengthsScript;
        })
        .catch(error => {
            console.error('Unable to fetch country phone lengths.', error);
        });

    // Fetch country calling code from IPAPI
    function fetchCountryCode() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data); // Debugging line
                countryCode = data.country_calling_code || '';
                if (countryCode) {
                    updatePlaceholder(countryCode);
                    selectCountryContainer.style.display = 'none'; // Hide select country input
                } else {
                    showCountrySelect();
                }
            })
            .catch(error => {
                console.error('Unable to fetch country code.', error);
                showCountrySelect();
            });
    }

    // Show country select dropdown
    function showCountrySelect() {
        countrySelect.style.display = 'block';
        populateCountrySelect();
    }

    // Populate the country select dropdown
    function populateCountrySelect() {
        fetch('js/countries.json') // Assumes you have a countries.json file with all countries and codes
            .then(response => response.json())
            .then(countries => {
                countrySelect.innerHTML = countries.map(country => 
                    `<option value="${country.code}">${country.name}</option>`
                ).join('');
                // Handle country selection change
                countrySelect.addEventListener('change', handleCountryChange);
            })
            .catch(error => console.error('Unable to fetch countries list.', error));
    }

    // Update placeholder with country code
    function updatePlaceholder(code) {
        if (code) {
            phoneInput.placeholder = `Enter Mobile number (${code})`;
        }
    }

    // Validate phone number
    function validatePhoneNumber(phoneNumber) {
        const trimmedNumber = phoneNumber.replace(/\D/g, '');
        const expectedLength = phoneLengths[countryCode];
        return trimmedNumber.length === expectedLength;
    }

    // Handle send message button click
    function handleSendMessage() {
        const phoneNumber = phoneInput.value.trim();
        if (validatePhoneNumber(phoneNumber)) {
            const fullNumber = `${countryCode}${phoneNumber}`;
            console.log('Opening WhatsApp with number:', fullNumber); // Debugging line
            window.location.href = `https://wa.me/${fullNumber}`;
        } else {
            errorDiv.textContent = `Please enter a valid phone number with ${countryCode}.`;
        }
    }

    // Handle country change
    function handleCountryChange() {
        countryCode = countrySelect.value;
        updatePlaceholder(countryCode);
        phoneInput.focus();
        selectCountryContainer.style.display = 'none'; // Hide select country input after selection
    }

    // Handle app install button
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
        installButton.style.display = 'block';
    });

    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt.');
                } else {
                    console.log('User dismissed the A2HS prompt.');
                }
                deferredPrompt = null;
            });
        }
    });

    // Initialize the app
    fetchCountryCode();
    sendButton.addEventListener('click', handleSendMessage); // Attach event listener for send button
});
