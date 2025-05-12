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

function handleRoleChange() {
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const photoSection = document.getElementById("photo-upload-section");
    const photoInput = document.getElementById("photo");
    
    if (role === "backer") {
        photoSection.style.display = "block";
        photoInput.required = true;
    } else {
        photoSection.style.display = "none";
        photoInput.required = false;
        photoInput.value = ""; 
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const photoInput = document.getElementById("photo");

    if (!username) {
        alert("Please enter a username");
        return;
    }

    if (password.length < 8 || password.length > 15 ) {
        alert("Password must be between 8 and 15 characters");    
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
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

    
    if (role === "backer") {
        if (!photoInput.files || photoInput.files.length === 0) {
            alert("Please upload a photo");
            return;
        }
        
       
        const file = photoInput.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a valid image file (JPEG, PNG, or GIF)");
            return;
        }
    }

    console.log("Signup Data:", { 
        username, 
        email, 
        password, 
        role,
        hasPhoto: photoInput?.files?.length > 0,
        photo: photoInput.files[0].src
    });
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
