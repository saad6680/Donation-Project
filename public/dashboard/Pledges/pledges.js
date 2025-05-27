 // get pledges
        async function getPledges() {
            const pledgesContainer = document.querySelector('.pledges');
            pledgesContainer.innerHTML = ''; // Clear existing content

            try {
                // Fetch campaigns first
                const campaignsResponse = await fetch('http://localhost:3000/campaigns');
                const campaigns = await campaignsResponse.json();
                // Map campaign IDs to titles
                const campaignMap = {};
                campaigns.forEach(campaign => {
                    campaignMap[campaign.id] = campaign.title;
                });

                // Fetch pledges
                const pledgesResponse = await fetch('http://localhost:3000/pledges');
                const pledges = await pledgesResponse.json();

                // Create table
                const table = document.createElement('table');
                table.className = 'pledges-table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Backer</th>
                            <th>Campaign</th>
                            <th>Amount (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                `;

                const tbody = table.querySelector('tbody');

                pledges.forEach(pledge => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${pledge.backerUsername}</td>
                        <td>${campaignMap[pledge.campaignId] || 'Unknown Campaign'}</td>
                        <td>$${parseFloat(pledge.amount).toFixed(2)}</td>
                    `;
                    tbody.appendChild(row);
                });

                pledgesContainer.appendChild(table);
            } catch (error) {
                console.error('Error fetching pledges or campaigns:', error);
                pledgesContainer.innerHTML = '<p class="error-message">Error loading pledges. Please try again later.</p>';
            }
        }

        window.addEventListener('load', () => {
            getPledges();
        });