function getData() {
    fetch('http://localhost:3000/campaigns/')
        .then(response => response.json())
        .then(data => {
            const personBoxes = document.querySelector('.person-boxes');
            personBoxes.innerHTML = ''; 
            const acceptedCampaigns = JSON.parse(localStorage.getItem('acceptedCampaignIds')) || [];
            const rejectedCampaigns = JSON.parse(localStorage.getItem('rejectedCampaignIds')) || [];

            data.forEach(campaign => {
                if (acceptedCampaigns.includes(campaign.id.toString()) || rejectedCampaigns.includes(campaign.id.toString())) {
                    return;
                }

                const campaignDiv = document.createElement('div');
                campaignDiv.classList.add('col-md-3', 'person-box');
                campaignDiv.style.width = '20rem';
                campaignDiv.setAttribute('data-id', campaign.id);
                campaignDiv.innerHTML = `
                    <img width='300px' height='250px'style='border-radius: 25px 25px 0 0' class='mb-3' src="${campaign.image}" alt="Campaign Image" />
                    <div class="card-body">
                        <h5 class="card-title mb-3">${campaign.title}</h5>
                        <p class="card-text">${campaign.description}</p>
                        <p> <b style="color: black;">$${campaign.minSalary}</b> raised of $${campaign.maxSalary} goal</p>
                        <div class="progress">
                            <div class="progress-bar bg-success" style="width: ${(campaign.minSalary / campaign.maxSalary) * 100}%"></div>
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
        .catch(error => console.error('Error fetching campaigns:', error));
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
    event.preventDefault()
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
function donationAmountAndCampaigns(){
    const donationTotal = localStorage.getItem('donationTotal');
    console.log(donationTotal);
    const acceptedCampaignsIds = JSON.parse(localStorage.getItem('acceptedCampaignIds')) || [];
    const donationAmountElement = document.querySelector('.donationAmount');
    const comapainsCount = document.querySelector('.comapainsCount');
    
    if(donationTotal && donationAmountElement) {
        console.log('Donation Amount:', donationTotal);
        donationAmountElement.innerText = parseFloat(donationTotal).toFixed(2);
        
    } 
    else if(donationAmountElement) {
        donationAmountElement.textContent = 'No Donations yet'
    }
    if (comapainsCount) {
        comapainsCount.innerText = acceptedCampaignsIds.length;
    }
    else {
        console.log('Campaigns count not found');
        
    }
}
window.addEventListener('load', donationAmountAndCampaigns)
