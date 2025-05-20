function displayTopCampaigns() {
    const container = document.querySelector('.donation-section .row');
    
    fetch('http://localhost:3000/campaigns')
        .then(response => response.json())
        .then(campaigns => {
            const sortedCampaigns = campaigns.sort((a, b) => b.minSalary - a.minSalary);
            
            const topCampaigns = sortedCampaigns.slice(0, 3);
            
            container.innerHTML = '';
            
            topCampaigns.forEach(campaign => {
                const deadlineDate = new Date(campaign.deadline);
                const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const campaignDiv = document.createElement('div');
                campaignDiv.classList.add('col-md-4');
                campaignDiv.innerHTML = `
                    <div class="campaign-card">
                        <img src="${campaign.image}" alt="${campaign.title}">
                        <div class="card-body">
                            <h5 class="card-title">${campaign.title}</h5>
                            <p class="card-text">${campaign.description.substring(0, 100)}...</p>
                            <div class="campaign-info">
                                <span>Goal: <strong>$${campaign.maxSalary}</strong></span>
                                <span>Raised: <strong>$${campaign.minSalary}</strong></span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-success" style="width: ${(campaign.minSalary / campaign.maxSalary) * 100}%"></div>
                            </div>
                            <div class="campaign-info">
                                <span>Deadline: <strong>${formattedDeadline}</strong></span>
                                <span>Category: <strong>${campaign.category}</strong></span>
                            </div>
                            <button class="btn btn-warning mt-3">
                                <a href="../DonateNow/dontateNow.html?campaignId=${campaign.id}">Donate Now</a>
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