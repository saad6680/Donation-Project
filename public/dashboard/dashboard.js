function getData() {
    const personBoxes = document.querySelector('.person-boxes');
    if (!personBoxes) {
        console.error('Person boxes container not found');
        return;
    }

    fetch('http://localhost:3000/campaigns/')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .then(data => {
            personBoxes.innerHTML = '';
            const pendingCampaigns = data.filter(campaign => campaign.status === 'pending');

            if (pendingCampaigns.length === 0) {
                personBoxes.innerHTML = '<p>No pending campaigns available.</p>';
                return;
            }

            pendingCampaigns.forEach(campaign => {
                if (!campaign.id) {
                    console.error('Campaign ID is missing:', campaign);
                    return;
                }

                const formattedDeadline = campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'N/A';
                const progressWidth = campaign.maxSalary > 0 ? (campaign.minSalary / campaign.maxSalary) * 100 : 0;

                const campaignDiv = document.createElement('div');
                campaignDiv.classList.add('col-md-3', 'person-box');
                campaignDiv.style.width = '20rem';
                campaignDiv.setAttribute('data-id', campaign.id);
                campaignDiv.innerHTML = `
                    <div class="campaign-card">
    <figure class="campaign-image">
        <img src="${campaign.image || 'path/to/fallback-image.jpg'}" alt="Campaign Image" 
             onclick="window.location.href='../Donations/donations.html?campaignId=${campaign.id}'" />
        <div class="image-overlay"></div>
    </figure>
    <div class="card-content">
        <h3 class="card-title">${campaign.title || 'Untitled'}</h3>
        <p class="card-description">${campaign.description || 'No description'}</p>
        <p class="funding-info">
            <strong style="color: #1a1a1a;">$${campaign.minSalary || 0}</strong> raised of 
            <strong>$${campaign.maxSalary || 0}</strong> goal
        </p>
        <div class="campaign-meta">
            <div class="meta-item">
                <span class="meta-label">Deadline</span>
                <strong>${formattedDeadline || 'N/A'}</strong>
            </div>
            <div class="meta-item">
                <span class="meta-label">Category</span>
                <strong>${campaign.category || 'N/A'}</strong>
            </div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progressWidth || 0}%"></div>
        </div>
        <div class="action-buttons">
            <button onclick="accept(event)" class="btn btn-accept">Accept</button>
            <button onclick="reject(event)" class="btn btn-reject">Reject</button>
        </div>
    </div>
</div>
                `;
                personBoxes.appendChild(campaignDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching campaigns:', error);
            personBoxes.innerHTML = '<p>Error loading campaigns. Please try again later.</p>';
        });
}

async function fetchTotalContainersAndBakers() {
    try {
        // Fetch campaigns to get total containers
        const campaignsResponse = await fetch('http://localhost:3000/campaigns');
        const campaigns = await campaignsResponse.json();

        // Fetch users to get total bakers
        const usersResponse = await fetch('http://localhost:3000/users');
        const users = await usersResponse.json();

        // Update the containers count
        const containersCount = document.querySelector('.comapainsCount');
        
        if (containersCount) {
            containersCount.textContent = campaigns.length;
            
        }

        // Update the bakers count
        const bakersCount = document.querySelector('.info-box:nth-child(3) .big');
        console.log(bakersCount);
        
        if (bakersCount) {
            bakersCount.textContent = users.length - 1;
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing dashboard');
    
    // Get user data and update navbar
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const userNameElement = document.querySelector('.user-dropdown .btn span');
        if (userNameElement) {
            userNameElement.textContent = user.name || 'Admin';
        }
    }
    
    await fetchTotalContainersAndBakers();
    getData();
    donationAmountAndCampaigns();
});

async function accept(event) {
    const campaignDiv = event.target.closest('.person-box');
    const campaignId = campaignDiv.getAttribute('data-id');

    try {
        const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'accepted' })
        });

        if (!response.ok) {
            throw new Error('Failed to accept campaign');
        }

        // Remove the campaign from the dashboard
        campaignDiv.remove();
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Campaign Accepted',
            text: 'The campaign has been accepted and is now visible to users.',
            timer: 2000,
            showConfirmButton: false
        });

        // Refresh the dashboard
        getData();
    } catch (error) {
        console.error('Error accepting campaign:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to accept campaign. Please try again.',
        });
    }
}

async function reject(event) {
    const campaignDiv = event.target.closest('.person-box');
    const campaignId = campaignDiv.getAttribute('data-id');

    try {
        const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'rejected' })
        });

        if (!response.ok) {
            throw new Error('Failed to reject campaign');
        }

        // Remove the campaign from the dashboard
        campaignDiv.remove();
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Campaign Rejected',
            text: 'The campaign has been rejected.',
            timer: 2000,
            showConfirmButton: false
        });

        // Refresh the dashboard
        getData();
    } catch (error) {
        console.error('Error rejecting campaign:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to reject campaign. Please try again.',
        });
    }
}

async function donationAmountAndCampaigns() {
    try {
        // Fetch all campaigns
        const response = await fetch('http://localhost:3000/campaigns');
        const campaigns = await response.json();

        // Calculate total from accepted campaigns
        const totalAmount = campaigns
            .filter(campaign => campaign.status === 'accepted')
            .reduce((sum, campaign) => sum + Number(campaign.minSalary), 0);

        // Update the donation amount display
        const donationAmountElement = document.querySelector('.donationAmount');
        if (donationAmountElement) {
            donationAmountElement.textContent = totalAmount.toFixed(2);
        }

        // Update the campaigns count
        const campaignsCount = document.querySelector('.campaignsCount');
        if (campaignsCount) {
            const acceptedCampaignsCount = campaigns.filter(campaign => campaign.status === 'accepted').length;
            campaignsCount.textContent = acceptedCampaignsCount;
        }
    } catch (error) {
        console.error('Error updating donation amount and campaigns:', error);
    }
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = '../login_signup/log&sign.html';
    });
} else {
    console.error('Logout button not found');
}