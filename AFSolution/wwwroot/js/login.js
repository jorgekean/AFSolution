const loginApiURL = '/home/login'; // Adjust this URL as needed

document.addEventListener('DOMContentLoaded', function () {
    // 1. Get all elements
    const emailInput = document.getElementById("email");
    const otpInput = document.getElementById("otp");
    const requestOtpBtn = document.getElementById("requestOtpBtn");
    const submitBtn = document.getElementById("submitBtn");
    const loginForm = document.getElementById("loginForm");
    // ... (error message elements if needed)

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    function validateFormState() {
        const emailIsValid = isEmailValid(emailInput.value);
        const otpIsValid = /^\d{6}$/.test(otpInput.value);

        // Enable 'Request OTP' button only when the email is valid AND it's not in a countdown state.
        if (!requestOtpBtn.hasAttribute('data-countdown')) {
            requestOtpBtn.disabled = !emailIsValid;
        }

        submitBtn.disabled = !(emailIsValid && otpIsValid);
    }

    // 2. Add validation listeners
    emailInput.addEventListener("input", validateFormState);
    otpInput.addEventListener("input", validateFormState);

    // 3. Add click listener for the 'Request OTP' button
    requestOtpBtn.addEventListener("click", function () {
        // In a real app, you would make an API call here to send the OTP
        console.log(`Requesting OTP for: ${emailInput.value}`);

        // --- Start Countdown Logic ---
        requestOtpBtn.disabled = true;
        requestOtpBtn.setAttribute('data-countdown', 'true'); // Mark as in countdown
        let countdown = 60;

        const interval = setInterval(() => {
            countdown--;
            requestOtpBtn.textContent = `Resend in ${countdown}s`;

            if (countdown <= 0) {
                clearInterval(interval);
                requestOtpBtn.textContent = 'Resend OTP';
                requestOtpBtn.removeAttribute('data-countdown');
                // Re-run validation to see if the button should be enabled
                validateFormState();
            }
        }, 1000);
    });

    // 4. Handle form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!submitBtn.disabled) {
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;
            
            // api call, redirect to home/dashboard if success, else show error
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    otp: otpInput.value
                })
            };
            fetch(`${loginApiURL}`, fetchOptions)
                .then(response => {
                    if (response.ok) {
                        // Redirect to home/dashboard
                        window.location.href = '/home/dashboard';
                    } else {
                        console.error('Error during login:', response);
                        // Handle error response
                        response.json().then(data => {
                            
                            submitBtn.textContent = 'Sign In';
                            submitBtn.disabled = false;

                            formError.textContent = "Invalid username or password";
                            formErrorContainer.classList.remove('hidden');
                        });
                    }
                })
                .catch(error => {
                    console.error('Error during login:', error);
                    alert('An unexpected error occurred. Please try again.');
                    submitBtn.textContent = 'Sign In';
                    submitBtn.disabled = false;

                    formError.textContent = "TEST";
                    formErrorContainer.classList.remove('hidden');

                });           
            
        }
    });
});
