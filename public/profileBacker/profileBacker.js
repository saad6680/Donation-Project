function displayDonations() {
    const container = document.querySelector('.donations-container');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const totalDonationsElement = document.getElementById('totalDonations');
    const totalAmountElement = document.getElementById('totalAmount');
    
    if (!container) {
        console.error('Donations container not found in the DOM');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
        console.error('No user logged in');
        container.innerHTML = '<p>Please log in to view your donations.</p>';
        if (usernameDisplay) usernameDisplay.textContent = 'Guest';
        return;
    }

    if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
    }

    fetch('http://localhost:3000/donations')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(donations => {
            const userDonations = donations.filter(donation => donation.backerUsername === user.username);
            
            if (totalDonationsElement) {
                totalDonationsElement.textContent = userDonations.length;
            }
            
            if (totalAmountElement) {
                const totalAmount = userDonations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
                totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
            }

            if (userDonations.length === 0) {
                container.innerHTML = '<p>No donations made yet.</p>';
                return;
            }

            container.innerHTML = ''; 

            const campaignPromises = userDonations.map(donation => 
                fetch(`http://localhost:3000/campaigns/${donation.campaignId}`)
                    .then(response => response.json())
            );

            Promise.all(campaignPromises)
                .then(campaigns => {
                    userDonations.forEach((donation, index) => {
                        const campaign = campaigns[index];
                        if (!campaign) return;

                        const donationDiv = document.createElement('div');
                        donationDiv.classList.add('col-md-4', 'mb-4');
                        donationDiv.innerHTML = `
                            <div class="card h-100">
                                <img src="${campaign.image}" class="card-img-top" alt="Campaign Image" style="height: 200px; object-fit: cover;">
                                <div class="card-body">
                                    <h5 class="card-title">${campaign.title}</h5>
                                    <p class="card-text">${campaign.description.substring(0, 100)}...</p>
                                    <div class="donation-details">
                                        <p class="mb-2"><strong>Donation Amount:</strong> $${donation.amount}</p>
                                        <p class="mb-2"><strong>Date:</strong> ${new Date(donation.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                        container.appendChild(donationDiv);
                    });
                })
                .catch(error => {
                    console.error('Error fetching campaign details:', error);
                    container.innerHTML = '<p>Error loading donation details.</p>';
                });
        })
        .catch(error => {
            console.error('Error fetching donations:', error);
            container.innerHTML = '<p>Error loading donations.</p>';
        });
}

document.getElementById('logOut')?.addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = '../login_signup/log&sign.html';
});

document.getElementById('changePasswordForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('User not logged in');
        return;
    }

    if (currentPassword !== user.password) {
        alert('Current password is incorrect');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }

    fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: newPassword
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update password');
        }
        return response.json();
    })
    .then(updatedUser => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Password updated successfully');
        const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        modal.hide();
        document.getElementById('changePasswordForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update password. Please try again.');
    });
});

document.getElementById('deleteAccountForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('deletePassword').value;
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('User not logged in');
        return;
    }

    if (password !== user.password) {
        alert('Incorrect password');
        return;
    }

    fetch('http://localhost:3000/donations')
        .then(response => response.json())
        .then(donations => {
            const userDonations = donations.filter(donation => donation.backerUsername === user.username);
            const deletePromises = userDonations.map(donation => 
                fetch(`http://localhost:3000/donations/${donation.id}`, {
                    method: 'DELETE'
                })
            );
            return Promise.all(deletePromises);
        })
        .then(() => {
            return fetch(`http://localhost:3000/users/${user.id}`, {
                method: 'DELETE'
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            localStorage.removeItem('user');
            window.location.href = '../login_signup/log&sign.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete account. Please try again.');
        });
});

document.addEventListener('DOMContentLoaded', () => {
    displayDonations();
});