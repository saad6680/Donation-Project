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
                    
                    const deadlineDate = new Date(campaign.deadline);
                    const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    campaignDiv.innerHTML = `
                        <div class="campaign-card">
    <figure class="campaign-image">
        <img onclick="window.location.href='../Donations/donations.html?campaignId=${campaign.id}'" 
             src="${campaign.image}" alt="Campaign Image" />
        <div class="image-overlay"></div>
    </figure>
    <div class="card-content">
        <h3 class="card-title">${campaign.title}</h3>
        <p class="card-description">${campaign.description}</p>
        <div class="campaign-stats">
            <div class="stat-item">
                <span class="stat-label">Goal</span>
                <strong>$${campaign.maxSalary}</strong>
            </div>
            <div class="stat-item">
                <span class="stat-label">Raised</span>
                <strong>$${campaign.minSalary}</strong>
            </div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${(campaign.minSalary / campaign.maxSalary) * 100}%"></div>
        </div>
        <div class="campaign-meta">
            <div class="meta-item">
                <span class="meta-label">Deadline</span>
                <strong>${formattedDeadline}</strong>
            </div>
            <div class="meta-item">
                <span class="meta-label">Category</span>
                <strong>${campaign.category}</strong>
            </div>
        </div>
        <a href="../DonateNow/donateNow.html?campaignId=${campaign.id}" class="donate-button">Donate Now</a>
    </div>
</div>
                    `;
                    container.appendChild(campaignDiv);

                    // const deleteIcon = campaignDiv.querySelector('.deleteIcon');
                    // deleteIcon.addEventListener('click', function () {
                    //     fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
                    //         method: 'DELETE'
                    //     })
                    //         .then(response => {
                    //             if (!response.ok) {
                    //                 throw new Error('Failed to delete campaign');
                    //             }
                    //             campaignDiv.remove();
                    //             const updatedCampaigns = userCampaigns.filter(c => c.id !== campaign.id);
                    //             numOfAcceptdCamp.innerText = updatedCampaigns.length;
                    //             if (updatedCampaigns.length === 0) {
                    //                 container.innerHTML = '<p>No campaigns created yet.</p>';
                    //             }
                    //         })
                    //         .catch(error => console.error('Error deleting campaign:', error));
                    // });
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
    localStorage.removeItem('profileImage');
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

    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        document.getElementById('profileImage').src = savedImage;
        document.querySelector('.dropdownImage').src = savedImage;
    }

    const profileImageInput = document.getElementById('profileImageInput');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                }
                // 5MG
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size should be less than 5MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageData = e.target.result;
                    document.getElementById('profileImage').src = imageData;
                    document.querySelector('.dropdownImage').src = imageData;
                    
                    localStorage.setItem('profileImage', imageData);

                    if (user) {
                        fetch(`http://localhost:3000/users/${user.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                profileImage: imageData
                            })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to update profile image');
                            }
                            return response.json();
                        })
                        .then(updatedUser => {
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                            alert('Profile image updated successfully');
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Failed to update profile image. Please try again.');
                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        });
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