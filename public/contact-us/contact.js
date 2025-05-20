document.addEventListener("DOMContentLoaded", function () {
    // Add footer in index.html
    fetch('../Footer/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fullName = document.getElementById("fullName");
            const emailAddress = document.getElementById("emailAddress");
            const phoneNumber = document.getElementById("phoneNumber");
            const message = document.getElementById("message");

            let isValid = true;
            clearFeedback();

            // Full Name validation
            if (!fullName.value.trim() || fullName.value.length < 4) {
                isValid = false;
                showFeedback(fullName, "Full Name is required and must be at least 4 characters long.");
            }

            // Email validation
            if (!emailAddress.value.trim()) {
                isValid = false;
                showFeedback(emailAddress, "Email Address is required.");
            } else if (!isValidEmail(emailAddress.value.trim())) {
                isValid = false;
                showFeedback(emailAddress, "Please enter a valid Email Address.");
            }

            // Phone number validation
            if (!phoneNumber.value.trim()) {
                isValid = false;
                showFeedback(phoneNumber, "Phone Number is required.");
            } else if (!isValidPhoneNumber(phoneNumber.value.trim())) {
                isValid = false;
                showFeedback(phoneNumber, "Please enter a valid 11-digit phone number.");
            }

            // Message validation
            if (!message.value.trim()) {
                isValid = false;
                showFeedback(message, "Message is required.");
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
                        contactForm.reset();
                        Swal.fire({
                            icon: 'success',
                            title: 'Message Sent!',
                            text: 'Your message was submitted successfully.',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                    })
                    .catch(error => {
                        console.error("Form submission error:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'An error occurred. Please try again.',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
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

    function showFeedback(element, message) {
        const existingFeedback = element.parentElement.querySelector(".form-feedback");
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedbackDiv = document.createElement("div");
        feedbackDiv.className = "form-feedback mt-2 p-2 rounded alert alert-danger";
        feedbackDiv.textContent = message;

        element.parentElement.appendChild(feedbackDiv);
    }

    function clearFeedback() {
        const feedbackElements = document.querySelectorAll(".form-feedback");
        feedbackElements.forEach(el => el.remove());
    }
});
