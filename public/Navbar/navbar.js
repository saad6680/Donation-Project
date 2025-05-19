function updateNavbar() {
    const loginButton = document.querySelector('.btn-success');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    } else {
        if (loginButton) {
            loginButton.style.display = 'block';
        }
    }
}

document.addEventListener('DOMContentLoaded', updateNavbar); 