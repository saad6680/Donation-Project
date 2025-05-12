function signup()
{
    document.querySelector(".login-form-container").style.cssText = "display: none;";
    document.querySelector(".signup-form-container").style.cssText = "display: block;";
    document.querySelector(".button-1").style.cssText = "display: none";
    document.querySelector(".button-2").style.cssText = "display: block";

};

function login()
{
    document.querySelector(".signup-form-container").style.cssText = "display: none;";
    document.querySelector(".login-form-container").style.cssText = "display: block;";
    document.querySelector(".button-2").style.cssText = "display: none";
    document.querySelector(".button-1").style.cssText = "display: block";

}

function validatePassword(password) {
    return password.length >= 8 && password.length <= 15;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.querySelector('input[name="role"]:checked')?.value;

    // Validation
    if (!username) {
        alert("Username is required");
        return false;
    }

    if (!validatePassword(password)) {
        alert("Password must be between 8 and 15 characters");
        return false;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address");
        return false;
    }

    if (!role) {
        alert("Please select a role");
        return false;
    }


    /*
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                role
            })
        });

        if (response.ok) {
            alert("Signup successful!");
            window.location.href = '/dashboard';
        } else {
            const data = await response.json();
            alert(data.message || "Signup failed. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred. Please try again later.");
    }
    */


    // Temporary success message for testing
    alert("Signup validation successful!");
    console.log("Form Data:", { username, email, password, role });
    return false;
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        alert("Please enter both username and password");
        return false;
    }

    
    /*
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (response.ok) {
            alert("Login successful!");
            window.location.href = '/dashboard';
        } else {
            const data = await response.json();
            alert(data.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred. Please try again later.");
    }
    */

    // Temporary success message for testing
    alert("Login validation successful!");
    console.log("Form Data:", { username, password });
    return false;
}
