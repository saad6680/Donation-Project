// Load navbar
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar content
    fetch('Navbar/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            updateNavbar();
        });

    // Load home content
    fetch('Home/home.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('home-placeholder').innerHTML = data;
        });

    // Load footer content
    fetch('Footer/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});

