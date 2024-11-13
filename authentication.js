


function isValidEmail(email){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
}

function isValidPassword(password){
    return password.length >= 8
}

//Login

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const passwordError = document.getElementById('loginPasswordError');
const emailError = document.getElementById('emailError');

if(loginForm){
    loginForm.addEventListener('submit', (event) =>{
        event.preventDefault()

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();


if(!email || !password){
    loginError.textContent = 'All field are required'
    return
}

if(!isValidEmail){
    emailError.textContent = 'Please enter a valid email address'
    return
}

const registeredUser = JSON.parse(localStorage.getItem('registeredUser'))
if(!registeredUser || registeredUser.email !== email || registeredUser.password !== password){
    passwordError.textContent = 'Invalid email or password'
    return
}

localStorage.setItem('authenticatedUser', 'true')
window.location.href = 'index.html'
})
}

//Sign Up
const signUpForm =document.getElementById('signUpForm')
const signUpError = document.getElementById('signUpError')

if(signUpForm){
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault()


        const email = document.getElementById('email').value.trim()
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('confirmPassword').value


        if(!email || !password || !confirmPassword){
            signUpError.textContent = 'All fields are required'
            return
        }
        if(!isValidEmail){
            emailError.textContent = 'Please enter a valid email address'
            return
        }
        if(!isValidPassword){
            passwordError.textContent = 'password must be at least 6 characters long'
            return
        }
        if(password !== confirmPassword){
            confirmPasswordError.textContent = 'Passwords do not match'
            return
        }

        const user = {email, password}
        localStorage.setItem('registeredUser',JSON.stringify(user))

        alert('Registration successful! please log in')
        window.location.href = 'login.html'
    })
}