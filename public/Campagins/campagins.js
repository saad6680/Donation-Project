// add footer in index.html
fetch('../Footer/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });



let allCampaigns = [];
const itemsPerPage = 8;
let currentPage = 1;

function handleUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        userDropdown.style.display = 'block';

        // Update navbar profile image
        const navbarProfileImage = document.querySelector('.dropdownImage');
        if (navbarProfileImage) {
            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) {
                navbarProfileImage.src = savedImage;
            }
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                localStorage.removeItem('profileImage');
                window.location.href = '../login_signup/log&sign.html';
            });
        }
    } else {
        userDropdown.style.display = 'none';
    }
}

function fetchAllCampaigns() {
    return fetch('http://localhost:3000/campaigns')
        .then(response => response.json())
        .then(campaigns => {
            // Filter to only show accepted campaigns
            allCampaigns = campaigns.filter(campaign => campaign.status === 'accepted');
            return allCampaigns;
        })
        .catch(error => {
            console.error('Error fetching campaigns:', error);
            return [];
        });
}

function filterAndSortCampaigns() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    let filteredCampaigns = allCampaigns.filter(campaign => {
        const matchesCategory = !categoryFilter || campaign.category === categoryFilter;
        const matchesSearch = !searchInput || 
            campaign.title.toLowerCase().includes(searchInput) || 
            campaign.description.toLowerCase().includes(searchInput);
        return matchesCategory && matchesSearch;
    });

    return filteredCampaigns;
}

function displayCampaigns(campaigns) {
    const container = document.querySelector('.accepted-campaign-container');
    if (!container) {
        console.error('Campaign container not found in the DOM');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCampaigns = campaigns.slice(startIndex, endIndex);

    if (paginatedCampaigns.length === 0) {
        container.innerHTML = '<p class="text-center w-100">No campaigns found.</p>';
        return;
    }

    paginatedCampaigns.forEach(campaign => {
        const deadlineDate = new Date(campaign.deadline);
        const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const campaignDiv = document.createElement('div');
        campaignDiv.classList.add('col-md-3', 'person-box', 'mb-4');
        campaignDiv.style.width = '20rem';
        campaignDiv.setAttribute('data-id', campaign.id);
        campaignDiv.innerHTML = `
            <div class="campaign-card">
    <figure class="campaign-image">
        <img onclick="window.location.href='../Donations/donations.html?campaignId=${campaign.id}'" 
            src="${campaign.image}" alt="Campaign Image" />
    </figure>
    <div class="card-content">
        <h3 class="card-title">${campaign.title}</h3>
        <p class="card-description">${campaign.description}</p>
        <div class="campaign-stats">
            <div class="stat-item">
                <span class="stat-label">Goal:</span>
                <strong>$${campaign.maxSalary}</strong>
            </div>
            <div class="stat-item">
                <span class="stat-label">Raised:</span>
                <strong>$${campaign.minSalary}</strong>
            </div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${(campaign.minSalary / campaign.maxSalary) * 100}%"></div>
        </div>
        <div class="campaign-meta">
            <div class="meta-item">
                <span class="meta-label">Deadline:</span>
                <strong>${formattedDeadline}</strong>
            </div>
            <div class="meta-item">
                <span class="meta-label">Category:</span>
                <strong>${campaign.category}</strong>
            </div>
        </div>
        <a href="../DonateNow/dontateNow.html?campaignId=${campaign.id}" target= '_blank' class="donate-button">Donate Now</a>
        
    </div>
</div>
        `;
        container.appendChild(campaignDiv);
    });

    updatePagination(campaigns.length);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
    </a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            displayCampaigns(filterAndSortCampaigns());
        }
    });
    pagination.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${currentPage === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayCampaigns(filterAndSortCampaigns());
        });
        pagination.appendChild(li);
    }

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
    </a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            displayCampaigns(filterAndSortCampaigns());
        }
    });
    pagination.appendChild(nextLi);
}

function setupEventListeners() {
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');

    categoryFilter.addEventListener('change', () => {
        currentPage = 1;
        displayCampaigns(filterAndSortCampaigns());
    });

    searchInput.addEventListener('input', () => {
        currentPage = 1;
        displayCampaigns(filterAndSortCampaigns());
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing campaigns page');
    handleUserDropdown();
    await fetchAllCampaigns();
    setupEventListeners();
    displayCampaigns(filterAndSortCampaigns());
});
