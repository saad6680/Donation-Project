function displayTopCampaigns() {
    const container = document.querySelector('.donation-section .row');
    
    // Fetch all campaigns
    fetch('http://localhost:3000/campaigns')
        .then(response => response.json())
        .then(campaigns => {
            const sortedCampaigns = campaigns.sort((a, b) => b.minSalary - a.minSalary);
            
            const topCampaigns = sortedCampaigns.slice(0, 3);
            
            container.innerHTML = '';
            
            topCampaigns.forEach(campaign => {
                const campaignDiv = document.createElement('div');
                campaignDiv.classList.add('col-md-4');
                campaignDiv.innerHTML = `
                    <div class="donation-card" onclick="window.location.href='../DonateNow/dontateNow.html?campaignId=${campaign.id}'" style="cursor: pointer;">
                        <img src="${campaign.image}" alt="${campaign.title}">
                        <div class="p-3">
                            <h5>${campaign.title}</h5>
                            <h6>${campaign.description.substring(0, 100)}...</h6>
                            <p><b style="color: black;">$${campaign.minSalary}</b> raised of $${campaign.maxSalary} goal</p>
                            <div class="progress">
                                <div class="progress-bar bg-success" style="width: ${(campaign.minSalary / campaign.maxSalary) * 100}%"></div>
                            </div>
                            <button class="btn btn-warning">
                                <a href="../DonateNow/dontateNow.html?campaignId=${campaign.id}" class="text-decoration-none text-dark">Donate Now</a>
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(campaignDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching campaigns:', error);
            container.innerHTML = '<div class="col-12 text-center"><p>Error loading campaigns. Please try again later.</p></div>';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    displayTopCampaigns();
}); 