// add navbar in index.html
fetch('./Navbar/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
    });

// add footer in index.html
fetch('./Footer/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });

// add Home in index.html
fetch('./Home/home.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('home-placeholder').innerHTML = data;
    });

