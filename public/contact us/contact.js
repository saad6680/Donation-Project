document.addEventListener("DOMContentLoaded", function() {
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

                
                const xhr = new XMLHttpRequest();
                const fakeEndpoint = "https://jsonplaceholder.typicode.com/posts"; 

                xhr.open("POST", fakeEndpoint, true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) { 
                        if (xhr.status === 200 || xhr.status === 201) { 
                            

                            console.log("Form submitted successfully:", xhr.responseText);
                            showFeedback(contactForm.querySelector("button[type='submit']"), "Message sent successfully!", true);
                            contactForm.reset(); 
                        } else {
                            
                            console.error("Form submission error:", xhr.status, xhr.responseText);
                            showFeedback(contactForm.querySelector("button[type='submit']"), "An error occurred. Please try again.", false);
                        }
                    }
                };

                xhr.onerror = function() {
                    console.error("Network error during form submission.");
                    showFeedback(contactForm.querySelector("button[type='submit']"), "A network error occurred. Please check your connection.", false);
                };
                
                console.log("Submitting data:", JSON.stringify(formData));
                xhr.send(JSON.stringify(formData));

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

