function updateNavbar() {
    const loginButton = document.querySelector('.btn-success');
    const userDropdown = document.getElementById('userDropdown');
    const profileLink = document.getElementById('profileLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameElements = document.querySelectorAll('#userName, #dropdownUserName');
    const userRoleElements = document.querySelectorAll('#userRole, #dropdownUserRole');

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // User is logged in - show dropdown, hide login button
        if (loginButton) loginButton.style.display = 'none';
        if (userDropdown) userDropdown.style.display = 'block';
        
        // Update user information
        userNameElements.forEach(element => {
            if (element) element.textContent = user.username || 'User';
        });
        
        userRoleElements.forEach(element => {
            if (element) element.textContent = user.role || 'User';
        });
        
        // Update profile link based on user role
        if (profileLink) {
            if (user.role === 'campaigner') {
                profileLink.href = '../profileCampaigner/profileCampaigner.html';
            } else if (user.role === 'backer') {
                profileLink.href = '../profileBacker/profileBacker.html';
            } else if (user.role === 'admin') {
                profileLink.href = '../dashboard/dashboard.html';
            }
        }

        // Add logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.href = '../login_signup/log&sign.html';
            });
        }
    } else {
        // User is not logged in - show login button, hide dropdown
        if (loginButton) loginButton.style.display = 'block';
        if (userDropdown) userDropdown.style.display = 'none';
    }
}

// Update navbar on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar(); // Call updateNavbar directly
}); 