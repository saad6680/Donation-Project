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
            const acceptedCampaigns = JSON.parse(localStorage.getItem('acceptedCampaignIds')) || [];
            const rejectedCampaigns = JSON.parse(localStorage.getItem('rejectedCampaignIds')) || [];

            if (data.length === 0 || data.every(campaign => acceptedCampaigns.includes(campaign.id.toString()) || rejectedCampaigns.includes(campaign.id.toString()))) {
                personBoxes.innerHTML = '<p>No new campaigns available.</p>';
                return;
            }

            data.forEach(campaign => {
                if (!campaign.id) {
                    console.error('Campaign ID is missing:', campaign);
                    return;
                }
                if (acceptedCampaigns.includes(campaign.id.toString()) || rejectedCampaigns.includes(campaign.id.toString())) {
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
        const containersCount = document.querySelector('.info-box.active .big');
        if (containersCount) {
            containersCount.textContent = campaigns.length;
        }

        // Update the bakers count
        const bakersCount = document.querySelector('.info-box:nth-child(4) .big');
        if (bakersCount) {
            bakersCount.textContent = users.length;
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing dashboard');
    await fetchTotalContainersAndBakers();
    getData();
    donationAmountAndCampaigns();
});

function accept(event) {
    try {
        const campaignCard = event.target.closest('.person-box');
        if (!campaignCard) {
            console.error('Campaign card not found');
            return;
        }
        const campaignId = campaignCard.getAttribute('data-id');
        console.log('Accepting campaign:', campaignId);

        campaignCard.remove();

        let acceptedCampaigns = JSON.parse(localStorage.getItem('acceptedCampaignIds')) || [];
        if (!acceptedCampaigns.includes(campaignId)) {
            acceptedCampaigns.push(campaignId);
            localStorage.setItem('acceptedCampaignIds', JSON.stringify(acceptedCampaigns));
            console.log('Updated acceptedCampaignIds:', acceptedCampaigns);
        }
    } catch (error) {
        console.error('Error in accept function:', error);
    }
}

function reject(event) {
    event.preventDefault();
    try {
        const campaignCard = event.target.closest('.person-box');
        if (!campaignCard) {
            console.error('Campaign card not found');
            return;
        }
        const campaignId = campaignCard.getAttribute('data-id');
        console.log('Rejecting campaign:', campaignId);

        campaignCard.remove();

        let rejectedCampaigns = JSON.parse(localStorage.getItem('rejectedCampaignIds')) || [];
        if (!rejectedCampaigns.includes(campaignId)) {
            rejectedCampaigns.push(campaignId);
            localStorage.setItem('rejectedCampaignIds', JSON.stringify(rejectedCampaigns));
        }

        setTimeout(() => {
            Swal.fire({
                icon: 'error',
                title: 'Campaign Rejected',
                text: 'The campaign was rejected',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
            });
        }, 2000);

    } catch (error) {
        console.error('Error in reject function:', error);
    }
}

function donationAmountAndCampaigns() {
    const donationTotal = localStorage.getItem('donationTotal');
    const acceptedCampaignsIds = JSON.parse(localStorage.getItem('acceptedCampaignIds')) || [];
    const donationAmountElement = document.querySelector('.donationAmount');
    const campaignsCount = document.querySelector('.campaignsCount');

    if (!donationAmountElement || !campaignsCount) {
        console.error('Donation amount or campaigns count element not found');
        return;
    }

    if (donationTotal && !isNaN(parseFloat(donationTotal))) {
        donationAmountElement.textContent = parseFloat(donationTotal).toFixed(2);
    } else {
        donationAmountElement.textContent = '0.00';
    }

    campaignsCount.textContent = acceptedCampaignsIds.length;
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