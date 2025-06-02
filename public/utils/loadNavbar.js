// Function to load navbar
function loadNavbar() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) return;

    fetch('/Navbar/navbar.html')
        .then(response => response.text())
        .then(data => {
            navbarPlaceholder.innerHTML = data;
            // Initialize navbar functionality
            updateNavbar();
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
}

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar); 