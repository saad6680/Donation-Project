fetch('./Navbar/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        if (typeof auth !== 'undefined') {
            auth.updateNavbar();
        }
    });

fetch('./Footer/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });

fetch('./Home/home.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('home-placeholder').innerHTML = data;
    });

