async function getUrl() {
    const url = new URLSearchParams(window.location.search);
    const campaignId = url.get('id');
    
    if (!campaignId) {
        console.log('No campaign ID found in URL');
        return null;
    }

    try {
        const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`);
        const campaignData = await response.json();
        console.log(campaignData);
        return campaignData;
    } catch (error) {
        console.error('Error fetching campaign:', error);
        return null;
    }
}


function updateHero(campaignData) {
    
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage && campaignData.image) {
        heroImage.src = campaignData.image;
        heroImage.alt = campaignData.title || 'Campaign Image';
    }

  
    const title = document.querySelector('.donation-content h2');
    if (title && campaignData.title) {
        title.textContent = campaignData.title;
    }

    
    const description = document.querySelector('.donation-content p');
    if (description && campaignData.description) {
        description.textContent = campaignData.description;
    }

    
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText && campaignData.raisedAmount && campaignData.goalAmount) {
        const raisedAmount = parseFloat(campaignData.raisedAmount);
        const goalAmount = parseFloat(campaignData.goalAmount);
        const percentage = (raisedAmount / goalAmount) * 100;
        
        progressBar.style.width = `${percentage}%`;
        progressText.innerHTML = `<span class="amount">$${raisedAmount.toLocaleString()}</span> raised of $${goalAmount.toLocaleString()} goal`;
    }

    
    if (campaignData.category) {
        const charityOptions = document.querySelectorAll('.charity-option');
        charityOptions.forEach(option => {
            const optionText = option.querySelector('span').textContent.toLowerCase();
            if (optionText.includes(campaignData.category.toLowerCase())) {
                option.style.color = '#FFD700';
            }
        });
    }
}


function DonateBtn() {
    const donateButton = document.querySelector('.btn-donate');
    if (donateButton) {
        donateButton.addEventListener('click', () => {
            const params = getUrl();
            console.log(params);
           
        });
    }
}


async function rePage() {
    const campaignData = await getUrl();
    if (campaignData) {
        updateHero(campaignData);
        DonateBtn();
    } else {
        console.log('No campaign data found');
    }
}


document.addEventListener('DOMContentLoaded', rePage);
