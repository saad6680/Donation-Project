// add footer in index.html
fetch('../Footer/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });

//-------------------------------------------------------------------------

function handleUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        userDropdown.style.display = 'block';

        // Add logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.href = '../login_signup/log&sign.html';
            });
        }
    } else {
        userDropdown.style.display = 'none';
    }
}

function displayAcceptedCampaigns() {
    const container = document.querySelector('.accepted-campaign-container');
    if (!container) {
        console.error('Accepted campaign container not found in the DOM');
        return;
    }
    
    const acceptedCampaignIds = JSON.parse(localStorage.getItem('acceptedCampaignIds')) || [];
    console.log('Accepted campaign IDs:', acceptedCampaignIds); 

    if (acceptedCampaignIds.length === 0) {
        container.innerHTML = '<p>No campaigns accepted yet.</p>';
        return;
    }

    acceptedCampaignIds.forEach(campaignId => {
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
                        <div class="campaign-card" onclick="window.location.href='../Donations/donations.html?campaignId=${campaign.id}'" style="cursor: pointer;">
                            <img width='300px' height='300px' class='mb-3' src="${campaign.image}" alt="Campaign Image" />
                            <div class="card-body">
                                <h5 class="card-title mb-3">${campaign.title}</h5>
                                <p class="card-text">${campaign.description}</p>
                                <p> <b style="color: black;">$${campaign.minSalary}</b> raised of $${campaign.maxSalary} goal</p>
                                <div class="progress mb-5">
                                    <div class="progress-bar bg-success" style="width: ${(campaign.minSalary / campaign.maxSalary) * 100}%"></div>
                                </div>
                                <button class='btn btn-warning mb-3'><a class='bBtn' href="../DonateNow/dontateNow.html?campaignId=${campaign.id}" target= '_blank'>Donate Now</a></button>
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
    console.log('DOM loaded, calling displayAcceptedCampaigns');
    handleUserDropdown();
    displayAcceptedCampaigns();
});
