window.addEventListener('load', function () {
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

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let user;
        try {
            user = JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            console.error('Error parsing user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please log in to make a donation',
            });
            return;
        }

        if (!user) {
            Swal.fire({
                icon: 'error',
                title: 'Not Logged In',
                text: 'Please log in to make a donation',
            });
            return;
        }

        const donation = parseFloat(donationNum.value);
        if (isNaN(donation) || donation <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Amount',
                text: 'Please enter a valid donation amount',
            });
            return;
        }

        if (campaignId) {
            // Create a new pledge in the database
            fetch('http://localhost:3000/pledges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    backerId: user.id,
                    backerUsername: user.username,
                    campaignId: campaignId,
                    amount: donation,
                    date: new Date().toISOString()
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create pledge');
                }
                return response.json();
            })
            .then(() => {
                // Update the campaign's raised amount
                return fetch(`http://localhost:3000/campaigns/${campaignId}`);
            })
            .then(response => response.json())
            .then(campaign => {
                const updatedMinSalary = (parseFloat(campaign.minSalary) || 0) + donation;
                return fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        minSalary: updatedMinSalary
                    })
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update campaign');
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Donation Successful',
                    text: 'Thank you for your donation!',
                }).then(() => {
                    window.location.href = '../profileBacker/profileBacker.html';
                });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Donation Failed',
                    text: 'Failed to process your donation. Please try again.',
                });
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No campaign selected for donation',
            });
        }
    });
});
