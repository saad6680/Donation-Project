async function getUrl() {
    const url = new URLSearchParams(window.location.search);
    console.log(url);
    
    const campaignId = url.get('campaignId');
    console.log(campaignId);
    
    
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
    // Update hero image
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage && campaignData.image) {
        heroImage.src = campaignData.image;
        heroImage.alt = campaignData.title || 'Campaign Image';
    }

    // Update title
    const title = document.querySelector('.donation-content h2');
    if (title && campaignData.title) {
        title.textContent = campaignData.title;
    }

    // Update description
    const description = document.querySelector('.donation-content p');
    if (description && campaignData.description) {
        description.textContent = campaignData.description;
    }

    // Update progress bar and amounts
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        const raisedAmount = parseFloat(campaignData.minSalary || 0);
        const goalAmount = parseFloat(campaignData.maxSalary || 0);
        const percentage = Math.min((raisedAmount / goalAmount) * 100, 100); // Ensure percentage doesn't exceed 100%
        
        // Reset progress bar width to 0 for animation
        progressBar.style.width = '0%';
        
        // Use setTimeout to trigger the animation
        setTimeout(() => {
            progressBar.style.transition = 'width 1s ease-in-out';
            progressBar.style.width = `${percentage}%`;
        }, 100);
        
        // Update the progress text with formatted numbers
        progressText.innerHTML = `
            <span class="amount">$${raisedAmount.toLocaleString()}</span> 
            raised of 
            <span class="goal-amount">$${goalAmount.toLocaleString()}</span> 
            goal
            <span class="percentage">(${Math.round(percentage)}%)</span>
        `;
    }

    // Update category
    if (campaignData.category) {
        const charityOptions = document.querySelectorAll('.charity-option');
        charityOptions.forEach(option => {
            const optionText = option.querySelector('span').textContent.toLowerCase();
            if (optionText.includes(campaignData.category.toLowerCase())) {
                option.style.color = '#FFD700';
            }
        });
    }

    // Update deadline if available
    if (campaignData.deadline) {
        const deadlineElement = document.querySelector('.campaign-deadline');
        if (deadlineElement) {
            const deadlineDate = new Date(campaignData.deadline);
            const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            deadlineElement.textContent = `Campaign ends on: ${formattedDeadline}`;
        }
    }
}


function DonateBtn() {
    const donateButton = document.querySelector('.btn-donate');
    if (donateButton) {
        donateButton.addEventListener('click', () => {
            const url = new URLSearchParams(window.location.search);
            const campaignId = url.get('campaignId');
            console.log(campaignId);
            window.location.href = `../DonateNow/donateNow.html?campaignId=${campaignId}`;
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
