function signup()
{
    document.querySelector(".login-form-container").style.display = "none";
    document.querySelector(".signup-form-container").style.display = "block";
    document.querySelector(".button-1").style.display = "none";
    document.querySelector(".button-2").style.display = "block";

};

function login()
{
    document.querySelector(".signup-form-container").style.display = "none";
    document.querySelector(".login-form-container").style.display = "block";
    document.querySelector(".button-2").style.display = "none";
    document.querySelector(".button-1").style.display = "block";

}

function validatePassword(password) {
    return password.length >= 8 && password.length <= 15;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.querySelector('input[name="role"]:checked')?.value;

 
    if (!username) {
        alert("Please enter a username");
        return;
    }

    if (password.length < 8 || password.length > 15) {
        alert("Password must be between 8 and 15 characters");
        return;
    }

    if (!email.includes("@")) {
        alert("Please enter a valid email");
        return;
    }

    if (!role) {
        alert("Please select a role");
        return;
    }

    
    console.log("Signup Data:", { username, email, password, role });
    alert("Signup successful!");
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

  
    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    
    console.log("Login Data:", { username, password });
    alert("Login successful!");
}
