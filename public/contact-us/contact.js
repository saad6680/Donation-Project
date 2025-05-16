document.addEventListener("DOMContentLoaded", function() {
    // add footer in index.html
fetch('../Footer/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // Get form elements
            const fullName = document.getElementById("fullName");
            const emailAddress = document.getElementById("emailAddress");
            const phoneNumber = document.getElementById("phoneNumber");
            const message = document.getElementById("message");

            let isValid = true;
            clearFeedback();

            // Full Name validation
            if (!fullName.value.trim() || fullName.value.length < 4) {
                isValid = false;
                showFeedback(fullName, "Full Name is required and must be at least 4 characters long.", false);
            }

            // Email validation
            if (!emailAddress.value.trim()) {
                isValid = false;
                showFeedback(emailAddress, "Email Address is required.", false);
            } else if (!isValidEmail(emailAddress.value.trim())) {
                isValid = false;
                showFeedback(emailAddress, "Please enter a valid Email Address.", false);
            }

            // Phone number validation
            if (!phoneNumber.value.trim()) {
                isValid = false;
                showFeedback(phoneNumber, "Phone Number is required.", false);
            } else if (!isValidPhoneNumber(phoneNumber.value.trim())) {
                isValid = false;
                showFeedback(phoneNumber, "Please enter a valid 11-digit phone number.", false);
            }

            // Message validation
            if (!message.value.trim()) {
                isValid = false;
                showFeedback(message, "Message is required.", false);
            }

            if (isValid) {
                const formData = {
                    fullName: fullName.value.trim(),
                    emailAddress: emailAddress.value.trim(),
                    phoneNumber: phoneNumber.value.trim(),
                    message: message.value.trim(),
                    apiKey: "" 
                };

                const fakeEndpoint = "https://jsonplaceholder.typicode.com/posts";

                fetch(fakeEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Form submitted successfully:", data);
                    showFeedback(contactForm.querySelector("button[type='submit']"), "Message sent successfully!", true);
                    contactForm.reset();
                })
                .catch(error => {
                    console.error("Form submission error:", error);
                    showFeedback(contactForm.querySelector("button[type='submit']"), "An error occurred. Please try again.", false);
                });

            } else {
                console.log("Form validation failed.");
            }
        });
    }

    function isValidEmail(email) {
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function isValidPhoneNumber(phoneNumber) {
        const phoneRegex = /^\d{11}$/;
        return phoneRegex.test(phoneNumber);
    }


    function showFeedback(element, message, isSuccess) {
        
        const existingFeedback = element.parentElement.querySelector(".form-feedback");
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedbackDiv = document.createElement("div");
        feedbackDiv.className = `form-feedback mt-2 p-2 rounded ${isSuccess ? "alert alert-success" : "alert alert-danger"}`;
        feedbackDiv.textContent = message;
        
        
        if(element.type === "submit"){
             element.parentElement.appendChild(feedbackDiv);
        } else {
            element.parentElement.appendChild(feedbackDiv);
        }
       
    }

    function clearFeedback() {
        const feedbackElements = document.querySelectorAll(".form-feedback");
        feedbackElements.forEach(el => el.remove());
    }

});

