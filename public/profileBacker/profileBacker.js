function displayDonatedCampaigns() {
    const container = document.querySelector('.accepted-campaign-container');
    if (!container) {
        console.error('Campaign container not found in the DOM');
        return;
    }

    const donatedCampaignIds = JSON.parse(localStorage.getItem('donatedCampaigns')) || [];
    console.log('Donated campaign IDs:', donatedCampaignIds);

    if (donatedCampaignIds.length === 0) {
        container.innerHTML = '<p>No campaigns donated to yet.</p>';
        return;
    }

    donatedCampaignIds.forEach(campaignId => {
        console.log('Fetching campaign:', campaignId);
        fetch(`http://localhost:3000/campaigns/${campaignId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(campaign => {
                console.log('Fetched campaign data:', campaign);
                if (!container.querySelector(`[data-id="${campaign.id}"]`)) {
                    const campaignDiv = document.createElement('div');
                    campaignDiv.classList.add('col-md-3', 'person-box', 'mb-4');
                    campaignDiv.style.width = '20rem';
                    campaignDiv.setAttribute('data-id', campaign.id);
                    campaignDiv.innerHTML = `
                        <div class="campaign-card">
                            <img width='300px' height='300px' class='mb-3' src="${campaign.image}" alt="Campaign Image" />
                            <div class="card-body">
                                <h5 class="card-title mb-3">${campaign.title}</h5>
                                <p class="card-text">${campaign.description}</p>
                                <p><b style="color: black;">$${campaign.minSalary}</b> raised of $${campaign.maxSalary} goal</p>
                                <div class="progress mb-5">
                                    <div class="progress-bar bg-success" style="width: ${(campaign.minSalary / campaign.maxSalary) * 100}%"></div>
                                </div>
                                <button class='btn btn-warning mb-3'><a class='bBtn' href="../DonateNow/dontateNow.html?campaignId=${campaign.id}">Donate Again</a></button>
                            </div>
                        </div>
                    `;
                    container.appendChild(campaignDiv);
                } else {
                    console.log(`Campaign ${campaign.id} already displayed`);
                }
            })
            .catch(error => console.error(`Error fetching campaign ${campaignId}:`, error));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, calling displayDonatedCampaigns');
    displayDonatedCampaigns();
});
