// functions for validation
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    return password.length >= 8;
}

// Sign Up Process
const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('signUpEmail').value.trim();
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpConfirmPassword').value;

        // Error messages
        const emailError = document.getElementById('signUpEmailError');
        const passwordError = document.getElementById('signUpPasswordError');
        const confirmPasswordError = document.getElementById('signUpConfirmPasswordError');
        const signUpMessage = document.getElementById('signUpMessage');

        // Reset error messages
        // emailError.textContent = '';
        // passwordError.textContent = '';
        // confirmPasswordError.textContent = '';
        // signUpMessage.textContent = '';

        // Validation
        if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            return;
        }

        if (!isValidPassword(password)) {
            passwordError.textContent = 'Password must be at least 8 characters long.';
            return;
        }

        if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            return;
        }

        // Store user details in localStorage
        const user = { email, password };
        localStorage.setItem('registeredUser', JSON.stringify(user));

        signUpMessage.textContent = 'Registration successful! Please log in.';
        alert('Registration successful! You can now log in.');
         window.location.href = 'login.html'
    });
}


// Log In Process
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Error messages
        const loginEmailError = document.getElementById('loginEmailError');
        const loginPasswordError = document.getElementById('loginPasswordError');
        const loginMessage = document.getElementById('loginMessage');

        // Reset error messages
        // loginEmailError.textContent = '';
        // loginPasswordError.textContent = '';
        // loginMessage.textContent = '';

        // Get user details from localStorage
        const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

        if (!registeredUser || registeredUser.email !== email || registeredUser.password !== password) {
            loginPasswordError.textContent = 'Invalid email or password.';
            return;
        }

        // Successful login
        localStorage.setItem('authenticatedUser', 'true');
        loginMessage.textContent = 'Login successful!';
        alert('Login successful!');
        window.location.href = 'index.html';
    });
}



document.addEventListener('DOMContentLoaded', () => {
    const loginLinkContainer = document.getElementById('loginLinkContainer');
    const logoutLinkContainer = document.getElementById('logoutLinkContainer');
    const logoutLink = document.getElementById('logoutLink');
    const loginLink = document.getElementById('loginLink');

    // Check the login state from localStorage
    let isLoggedIn = localStorage.getItem('authenticatedUser') === 'true';

    // Function to update the visibility of login and logout links
    function updateAuthLinks() {
        if (isLoggedIn) {
            loginLinkContainer.style.display = 'none';
            logoutLinkContainer.style.display = 'block';
            // loginLink.textContent = 'Logout'
        } else {
            loginLinkContainer.style.display = 'block';
            logoutLinkContainer.style.display = 'none';
        }
    }

    // Handle logout click
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior
            isLoggedIn = false; // Update login state
            localStorage.removeItem('authenticatedUser'); // Clear login data from localStorage
            updateAuthLinks(); // Update link visibility
            alert('You have successfully logged out!');
        });
    }

    // Initialize link visibility on page load
    updateAuthLinks();
});

  

