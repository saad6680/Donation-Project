const auth = {
    isAuthenticated() {
        const user = JSON.parse(localStorage.getItem('user'));
        return !!user;
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    isCampaigner() {
        const user = this.getCurrentUser();
        if (this.getCurrentUser().status === 'false') {
            alert('Your account is blocked');
            window.location.href = '/login_signup/log&sign.html';
        }
        return user && user.role === 'campaigner';
    },

    isBacker() {
        if (this.getCurrentUser().status === 'false') {
            alert('Your account is blocked');
            window.location.href = '/login_signup/log&sign.html';
        }
        const user = this.getCurrentUser();
        return user && user.role === 'backer';
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    updateNavbar() {
        const loginButton = document.querySelector('.btn-success');
        const userDropdown = document.getElementById('userDropdown');
        const profileLink = document.getElementById('profileLink');
        const user = this.getCurrentUser();
        
        if (user) {
            // User is logged in
            if (loginButton) loginButton.style.display = 'none';
            if (userDropdown) userDropdown.style.display = 'block';
            
            // Update profile link based on user role
            if (profileLink) {
                if (user.role === 'campaigner') {
                    profileLink.href = './profileCampaigner/profileCampaigner.html';
                } else if (user.role === 'backer') {
                    profileLink.href = './profileBacker/profileBacker.html';
                }
            }
        } else {
            // User is not logged in
            if (loginButton) loginButton.style.display = 'block';
            if (userDropdown) userDropdown.style.display = 'none';
        }
    },

    handleLogout() {
        localStorage.removeItem('user');
        window.location.href = '/login_signup/log&sign.html';
    },

    protectRoute(requiredRole) {
        const user = this.getCurrentUser();
        
        if (!user) {
            window.location.href = '/login_signup/log&sign.html';
            return false;
        }

        if (requiredRole && user.role !== requiredRole) {
            if (user.role === 'campaigner') {
                window.location.href = '/profileCampaigner/profileCampaigner.html';
            } else if (user.role === 'backer') {
                window.location.href = '/profileBacker/profileBacker.html';
            } else if (user.role === 'admin') {
                window.location.href = '/dashboard/dashboard.html';
            }
            return false;
        }

        return true;
    },

    init() {
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        this.updateNavbar();
                        const logoutBtn = document.getElementById('logoutBtn');
                        if (logoutBtn) {
                            logoutBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                this.handleLogout();
                            });
                        }
                    }
                });
            });

            observer.observe(navbarPlaceholder, { childList: true, subtree: true });
        } else {
            this.updateNavbar();
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }
        }

        if (window.location.pathname.includes('DonateNow')) {
            if (this.isCampaigner()) {
                alert('Campaigners cannot make donations');
                window.location.href = '/profileCampaigner/profileCampaigner.html';
            }
        }

        if (window.location.pathname.includes('addCampaign')) {
            if (this.isBacker()) {
                alert('Backers cannot create campaigns');
                window.location.href = '/profileBacker/profileBacker.html';
            }
        }

        if (window.location.pathname.includes('dashboard')) {
            if (!this.isAuthenticated()) {
                alert('Please log in to access the dashboard');
                window.location.href = '/login_signup/log&sign.html';
                return;
            }

            if (!this.isAdmin()) {
                alert('Access denied. Only administrators can access the dashboard.');
                if (this.isCampaigner()) {
                    window.location.href = '/profileCampaigner/profileCampaigner.html';
                } else if (this.isBacker()) {
                    window.location.href = '/profileBacker/profileBacker.html';
                } else {
                    window.location.href = '/login_signup/log&sign.html';
                }
                return;
            }

            if (window.location.pathname.includes('users')) {
                if (!this.isAdmin()) {
                    alert('Access denied. Only administrators can access user management.');
                    window.location.href = '/dashboard/dashboard.html';
                    return;
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    auth.init();
}); 