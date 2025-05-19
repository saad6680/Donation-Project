function displayAcceptedCampaigns() {
    const container = document.querySelector('.accepted-campaign-container');
    if (!container) {
        console.error('Accepted campaign container not found in the DOM');
        return;
    }

    const acceptedCampaignIds = JSON.parse(localStorage.getItem('acceptedCampaignIds')) || [];
    const numOfAcceptdCamp = document.getElementById('numCamp');
    numOfAcceptdCamp.innerText = acceptedCampaignIds.length;

    console.log('Accepted campaign IDs:', acceptedCampaignIds);
    console.log(acceptedCampaignIds.length);

    if (acceptedCampaignIds.length === 0) {
        container.innerHTML = '<p>No campaigns accepted yet.</p>';
        return;
    }

    // Clear container only if campaigns exist to avoid duplicate renders
    container.innerHTML = '';

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
                        <div class="deleteIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 24 24">
                                <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                            </svg>
                        </div>
                        <img width='300px' height='300px' class='mb-3' src="${campaign.imageSrc}" alt="Campaign Image" />
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
                        // Remove the specific campaign ID from acceptedCampaignIds
                        const updatedCampaignIds = acceptedCampaignIds.filter(id => id !== campaign.id);
                        localStorage.setItem('acceptedCampaignIds', JSON.stringify(updatedCampaignIds));
                        numOfAcceptdCamp.innerText = updatedCampaignIds.length;
                        campaignDiv.remove();
                        if (updatedCampaignIds.length === 0) {
                            container.innerHTML = '<p>No campaigns accepted yet.</p>';
                        }
                    });
                } else {
                    console.log(`Campaign ${campaign.id} already displayed`);
                }
            })
            .catch(error => console.error(`Error fetching campaign ${campaignId}:`, error));
    });
}
let logOut = document.getElementById('logOut');

logOut.addEventListener('click', function(){
    localStorage.removeItem("user");
    window.location.href = "../login_signup/log&sign.html"
})
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, calling displayAcceptedCampaigns');
    displayAcceptedCampaigns();
});