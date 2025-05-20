const logOut = document.getElementById('logOut');
logOut.addEventListener('click', function () {
    localStorage.removeItem('user');
    localStorage.removeItem('donatedCampaigns');
    localStorage.removeItem('currentDonate');
    window.location.href = '../login_signup/log&sign.html';
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing page');
    
    let user;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        alert('Error retrieving user data. Please log in again.');
        window.location.href = '../login_signup/log&sign.html';
        return;
    }

    const usernameDisplay = document.getElementById('usernameDisplay');
    if (user && usernameDisplay) {
        usernameDisplay.textContent = user.username;
    } else if (!user) {
        alert('User not logged in');
        window.location.href = '../login_signup/log&sign.html';
        return;
    }

    ProfileUtils.loadProfileImage();

    const profileImageInput = document.getElementById('profileImageInput');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                ProfileUtils.handleImageUpload(file, user?.id)
                    .then(message => {
                        alert(message);
                    })
                    .catch(error => {
                        alert(error);
                    });
            }
        });
    }

    displayPledges();
});

document.getElementById('changePasswordForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Submitting changePasswordForm');

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let user;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error('Error parsing user:', error);
        alert('Error retrieving user data. Please log in again.');
        window.location.href = '../login_signup/log&sign.html';
        return;
    }

    if (!user) {
        alert('User not logged in');
        window.location.href = '../login_signup/log&sign.html';
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
            currentPassword: currentPassword,
            password: newPassword
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Failed to update password: ${text}`);
            });
        }
        return response.json();
    })
    .then(updatedUser => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Password updated successfully');
        const modalElement = document.getElementById('settingsModal');
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();
        document.getElementById('changePasswordForm').reset();
    })
    .catch(error => {
        console.error('Error updating password:', error);
        alert(`Failed to update password: ${error.message}`);
    });
});

document.getElementById('deleteAccountForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Submitting deleteAccountForm');

    const password = document.getElementById('deletePassword').value;

    let user;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error('Error parsing user:', error);
        alert('Error retrieving user data. Please log in again.');
        window.location.href = '../login_signup/log&sign.html';
        return;
    }

    if (!user) {
        alert('User not logged in');
        window.location.href = '../login_signup/log&sign.html';
        return;
    }

    fetch(`http://localhost:3000/users/${user.id}/verify-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Password verification failed: ${text}`);
            });
        }
        return fetch('http://localhost:3000/campaigns');
    })
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
        localStorage.removeItem('donatedCampaigns');
        localStorage.removeItem('currentDonate');
        window.location.href = '../login_signup/log&sign.html';
    })
    .catch(error => {
        console.error('Error deleting account:', error);
        alert(`Failed to delete account: ${error.message}`);
    });
});

function displayPledges() {
    let user;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error('Error parsing user:', error);
        alert('Error retrieving user data. Please log in again.');
        window.location.href = '../login_signup/log&sign.html';
        return;
    }

    if (!user) {
        console.error('No user logged in');
        window.location.href = '../login_signup/log&sign.html';
        return;
    }

    const tableBody = document.getElementById('pledgesTableBody');
    if (!tableBody) {
        console.error('Pledges table body not found');
        return;
    }

    tableBody.innerHTML = '';

    fetch('http://localhost:3000/campaigns')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch campaigns');
            }
            return response.json();
        })
        .then(campaigns => {
            console.log('All campaigns:', campaigns);
            let donatedCampaigns = [];
            try {
                donatedCampaigns = JSON.parse(localStorage.getItem('donatedCampaigns')) || [];
            } catch (error) {
                console.error('Error parsing donatedCampaigns:', error);
            }

            if (!Array.isArray(donatedCampaigns)) {
                console.error('donatedCampaigns is not an array:', donatedCampaigns);
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">No pledges found</td>
                    </tr>
                `;
                return;
            }

            donatedCampaigns.forEach((donation, index) => {
                console.log('Processing donation:', donation);
                const campaign = campaigns.find(c => c.id === donation.campaignId);
                if (campaign) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${donation.username || user.username}</td>
                        <td>${campaign.title || 'Untitled Campaign'}</td>
                        <td>$${parseFloat(donation.amount || 0).toFixed(2)}</td>
                    `;
                    tableBody.appendChild(row);
                } else {
                    console.warn('Campaign not found for donation:', donation);
                }
            });

            if (donatedCampaigns.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">No pledges found</td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching campaigns:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger">Error loading pledges: ${error.message}</td>
                </tr>
            `;
        });
}

window.addEventListener('load', function() {
    const submitBtn = document.querySelector('form button[type="submit"]');
    const donationNum = document.querySelector('#validationDefault05');

    if (!submitBtn || !donationNum) {
        console.warn('Donation form elements not found');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('campaignId');

    if (campaignId) {
        fetch(`http://localhost:3000/campaigns/${campaignId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch campaign');
                }
                return response.json();
            })
            .then(campaign => {
                const form = document.querySelector('form');
                if (form) {
                    const campaignInfo = document.createElement('div');
                    campaignInfo.classList.add('col-md-12', 'mb-4');
                    campaignInfo.innerHTML = `
                        <h4>Campaign Details</h4>
                        <p><strong>Title:</strong> ${campaign.title}</p>
                        <p><strong>Description:</strong> ${campaign.description}</p>
                        <p><strong>Goal:</strong> $${campaign.maxSalary}</p>
                        <p><strong>Raised so far:</strong> $${campaign.minSalary}</p>
                    `;
                    form.insertBefore(campaignInfo, form.firstChild);
                }
            })
            .catch(error => console.error('Error fetching campaign details:', error));
    }

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        let user;
        try {
            user = JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            console.error('Error parsing user:', error);
            alert('Error retrieving user data. Please log in again.');
            window.location.href = '../login_signup/log&sign.html';
            return;
        }

        if (!user) {
            alert('User not logged in');
            window.location.href = '../login_signup/log&sign.html';
            return;
        }

        const donation = parseFloat(donationNum.value);
        if (isNaN(donation) || donation <= 0) {
            console.log('Invalid donation amount');
            alert('Please enter a valid donation amount');
            return;
        }

        let currentTotal = parseFloat(localStorage.getItem('donationTotal')) || 0;
        currentTotal += donation;
        localStorage.setItem('donationTotal', currentTotal);

        if (campaignId) {
            let donatedCampaigns = [];
            try {
                donatedCampaigns = JSON.parse(localStorage.getItem('donatedCampaigns')) || [];
            } catch (error) {
                console.error('Error parsing donatedCampaigns:', error);
            }

            const existingDonation = donatedCampaigns.find(d => d.campaignId === campaignId);
            if (existingDonation) {
                existingDonation.amount += donation;
            } else {
                donatedCampaigns.push({ 
                    campaignId, 
                    amount: donation,
                    username: user.username
                });
            }
            localStorage.setItem('donatedCampaigns', JSON.stringify(donatedCampaigns));

            fetch(`http://localhost:3000/campaigns/${campaignId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch campaign');
                    }
                    return response.json();
                })
                .then(campaign => {
                    const updatedMinSalary = (parseFloat(campaign.minSalary) || 0) + donation;
                    return fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            minSalary: updatedMinSalary
                        })
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update campaign');
                    }
                    window.location.href = '../profileBacker/profileBacker.html';
                })
                .catch(error => {
                    console.error('Error updating campaign:', error);
                    alert(`Failed to record donation: ${error.message}`);
                });
        } else {
            console.log('No campaign ID provided');
            alert('No campaign selected for donation');
        }
    });
});