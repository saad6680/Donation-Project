function signup() {
    document.querySelector(".login-form-container").style.display = "none";
    document.querySelector(".signup-form-container").style.display = "block";
    document.querySelector(".button-1").style.display = "none";
    document.querySelector(".button-2").style.display = "block";

};

function login() {
    document.querySelector(".signup-form-container").style.display = "none";
    document.querySelector(".login-form-container").style.display = "block";
    document.querySelector(".button-2").style.display = "none";
    document.querySelector(".button-1").style.display = "block";

}

function validatePassword(password) {
    const minLength = 8;
    const maxLength = 15;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return (
        password.length >= minLength &&
        password.length <= maxLength &&
        hasNumber.test(password) &&
        hasSpecialChar.test(password)
    );
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function displayError(containerId, message, color = "red") {
    const errorContainer = document.getElementById(containerId);
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.color = color;
    } else {
        alert(message);
    }
}

function clearErrors() {
    const errorContainers = document.querySelectorAll(".error-message");
    errorContainers.forEach((container) => (container.textContent = ""));
}


function showSignupForm() {
    document.querySelector(".login-form-container").style.display = "none";
    document.querySelector(".signup-form-container").style.display = "block";
    document.querySelector(".button-1").style.display = "none";
    document.querySelector(".button-2").style.display = "block";
}

function showLoginForm() {
    document.querySelector(".signup-form-container").style.display = "none";
    document.querySelector(".login-form-container").style.display = "block";
    document.querySelector(".button-2").style.display = "none";
    document.querySelector(".button-1").style.display = "block";
}


let isSubmitting = false;


async function handleSignup(event) {
    event.preventDefault();

    if (isSubmitting) {
        return;
    }

    isSubmitting = true;
    clearErrors();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const status = "true";
    

    if (!username) {
        displayError("signup-error", "Please enter a username");
        isSubmitting = false;
        return;
    }

    if (!validateEmail(email)) {
        displayError("signup-error", "Please enter a valid email");
        isSubmitting = false;
        return;
    }

    if (!validatePassword(password)) {
        displayError(
            "signup-error",
            "Password must be 8-15 characters, with a number and special character"
        );
        isSubmitting = false;
        return;
    }

    if (password !== confirmPassword) {
        displayError("signup-error", "Passwords do not match");
        isSubmitting = false;
        return;
    }

    if (!role) {
        displayError("signup-error", "Please select a role");
        isSubmitting = false;
        return;
    }

    try {
        // check users 
        const checkResponse = await fetch(`http://localhost:3000/users?username=${username}&email=${email}`);
        const existsUsers = await checkResponse.json();

        if (existsUsers.some(user => user.username === username)) {
            displayError("signup-error", "Username already exists");
            isSubmitting = false;
            return;
        }

        if (existsUsers.some(user => user.email === email)) {
            displayError("signup-error", "Email already exists");
            isSubmitting = false;
            return;
        }

        const userinfo = {
            username,
            email,
            password,
            role,
            status
        };

        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userinfo)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("User created:", data);
        displayError("signup-error", "Signup successful!", "green");
        document.getElementById("signupForm").reset();
        showLoginForm();
    } catch (error) {
        console.error("Error:", error);
        displayError("signup-error", error.message || "Signup failed. Please try again.");
    } finally {
        isSubmitting = false;
    }
}


function handleLogin(event) {
    event.preventDefault();
    clearErrors();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    // Validate inputs are present
    if (!username || !password) {
        displayError("login-error", "Please enter both username and password");
        return;
    }


    fetch("http://localhost:3000/users")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            const user = data.find(user =>
                user.username === username && user.password === password && user.status !== 'false'
            );
            if (user) {
                displayError("login-error", "Login successful!", "green");
                localStorage.setItem("user", JSON.stringify(user));
                if (user.role === "campaigner") {
                    window.location.href = "../profileCampaigner/profileCampaigner.html";
                } else if (user.role === "backer") {
                    window.location.href = "../profileBacker/profileBacker.html";
                } else {
                    window.location.href = "../dashboard/dashboard.html";
                }
            } else {
                displayError("login-error", "Invalid username or password");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            displayError("login-error", "Login failed. Please try again.");
        });
}

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const button1 = document.querySelector(".button-1");
const button2 = document.querySelector(".button-2");

if (signupForm) {
    signupForm.removeEventListener("submit", handleSignup);
    signupForm.addEventListener("submit", handleSignup, { once: true });
}

if (loginForm) {
    loginForm.removeEventListener("submit", handleLogin);
    loginForm.addEventListener("submit", handleLogin);
}

if (button1) {
    button1.removeEventListener("click", showSignupForm);
    button1.addEventListener("click", showSignupForm);
}

if (button2) {
    button2.removeEventListener("click", showLoginForm);
    button2.addEventListener("click", showLoginForm);
}
