function displayAcceptedCampaigns() {
    const container = document.querySelector('.accepted-campaign-container');
    const usernameDisplay = document.getElementById('usernameDisplay'); 
    if (!container) {
        console.error('Accepted campaign container not found in the DOM');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
        console.error('No user logged in');
        container.innerHTML = '<p>Please log in to view your campaigns.</p>';
        if (usernameDisplay) usernameDisplay.textContent = 'Guest';
        return;
    }

    if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
    }

    fetch('http://localhost:3000/campaigns')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(campaigns => {
            const userCampaigns = campaigns.filter(campaign => campaign.creatorUsername === user.username);
            const numOfAcceptdCamp = document.getElementById('numCamp');
            numOfAcceptdCamp.innerText = userCampaigns.length;

            if (userCampaigns.length === 0) {
                container.innerHTML = '<p>No campaigns created yet.</p>';
                return;
            }

            container.innerHTML = '';

            userCampaigns.forEach(campaign => {
                if (!container.querySelector(`[data-id="${campaign.id}"]`)) {
                    const campaignDiv = document.createElement('div');
                    campaignDiv.classList.add('col-md-3', 'person-box', 'mb-4');
                    campaignDiv.style.width = '20rem';
                    campaignDiv.setAttribute('data-id', campaign.id);
                    campaignDiv.innerHTML = `
                        <div class="deleteIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 24 24">
                                <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                            </svg>
                        </div>
                        <img width='300px' height='300px' class='mb-3' src="${campaign.image}" alt="Campaign Image" />
                        <div class="card-body">
                            <h5 class="card-title mb-3">${campaign.title}</h5>
                            <p class="card-text">${campaign.description}</p>
                            <p><b style="color: black;">$${campaign.minSalary}</b> raised of $${campaign.maxSalary} goal</p>
                            <div class="progress mb-5">
                                <div class="progress-bar bg-success" style="width: ${(campaign.minSalary / campaign.maxSalary) * 100}%"></div>
                            </div>
                        </div>
                    `;
                    container.appendChild(campaignDiv);

                    const deleteIcon = campaignDiv.querySelector('.deleteIcon');
                    deleteIcon.addEventListener('click', function () {
                        fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete campaign');
                                }
                                campaignDiv.remove();
                                const updatedCampaigns = userCampaigns.filter(c => c.id !== campaign.id);
                                numOfAcceptdCamp.innerText = updatedCampaigns.length;
                                if (updatedCampaigns.length === 0) {
                                    container.innerHTML = '<p>No campaigns created yet.</p>';
                                }
                            })
                            .catch(error => console.error('Error deleting campaign:', error));
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching campaigns:', error);
            container.innerHTML = '<p>Error loading campaigns.</p>';
        });
}

let logOut = document.getElementById('logOut');

logOut.addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = '../login_signup/log&sign.html';
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, calling displayAcceptedCampaigns');
    displayAcceptedCampaigns();

    const user = JSON.parse(localStorage.getItem('user'));
    const addCampaignBtn = document.querySelector('.btn-success');
    if (user && user.role === 'backer' && addCampaignBtn) {
        addCampaignBtn.style.display = 'none';
    }
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

    fetch('http://localhost:3000/campaigns')
        .then(response => response.json())
        .then(campaigns => {
            const userCampaigns = campaigns.filter(campaign => campaign.creatorUsername === user.username);
            const deletePromises = userCampaigns.map(campaign => 
                fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
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