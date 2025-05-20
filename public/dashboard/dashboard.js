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
                    <img width='300px' height='250px' style='border-radius: 25px 25px 0 0' class='mb-3' src="${campaign.image || 'path/to/fallback-image.jpg'}" alt="Campaign Image" />
                    <div class="card-body">
                        <h5 class="card-title mb-3">${campaign.title || 'Untitled'}</h5>
                        <p class="card-text">${campaign.description || 'No description'}</p>
                        <p> <b style="color: black;">$${campaign.minSalary || 0}</b> raised of $${campaign.maxSalary || 0} goal</p>
                        <div class="campaign-info">
                            <span>Deadline: <strong>${formattedDeadline}</strong></span>
                            <span>Category: <strong>${campaign.category || 'N/A'}</strong></span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-success" style="width: ${progressWidth}%"></div>
                        </div>
                        <div class="box-btns mt-4">
                            <button onclick="accept(event)" class="btn btn-success" type="button">Accept</button>
                            <button onclick="reject(event)" class="btn btn-danger" type="button">Reject</button>
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
getData();

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

        alert('The campaign was rejected');
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
window.addEventListener('load', donationAmountAndCampaigns);

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = '../login_signup/log&sign.html';
    });
} else {
    console.error('Logout button not found');
}