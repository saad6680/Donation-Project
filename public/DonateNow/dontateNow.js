window.addEventListener('load', function(){
    const submitBtn = document.querySelector('button[type="submit"]');
    const donationNum = document.querySelector('#validationDefault05');
    
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('campaignId');
    
    if (campaignId) {
        fetch(`http://localhost:3000/campaigns/${campaignId}`)
            .then(response => response.json())
            .then(campaign => {
                const form = document.querySelector('form');
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
            })
            .catch(error => console.error('Error fetching campaign details:', error));
    }
    
    submitBtn.addEventListener('click', function(e){
        e.preventDefault();
        let donation = parseFloat(donationNum.value);
        console.log(donation);
        if (!isNaN(donation) && donation > 0) {
            let currentTotal = parseFloat(localStorage.getItem('donationTotal')) || 0;
            currentTotal += donation;
            localStorage.setItem('donationTotal', currentTotal);

            if (campaignId) {
                let donatedCampaigns = JSON.parse(localStorage.getItem('donatedCampaigns')) || [];
                if (!donatedCampaigns.includes(campaignId)) {
                    donatedCampaigns.push(campaignId);
                    localStorage.setItem('donatedCampaigns', JSON.stringify(donatedCampaigns));
                }
            }

            window.location.href = '../profileBacker/profileBacker.html'; 
        } else {
            console.log('invalid donation');
            alert('please enter a valid donation');
        }
    });
});
