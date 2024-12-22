document.getElementById("companies").addEventListener("sectionEnter", async () => {
    try {
        const companies = await fetchCompanies();
        displayCompanies(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        displayErrorMessage('Failed to load company data. Please try again later.');
    }
});

async function fetchCompanies() {
    let companies;
    try {
        const response = await fetch('http://localhost:5500/data/companies.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        companies = await response.json();
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error; // Rethrow error to be caught by the outer try-catch
    }
    return companies;
}

function displayCompanies(companies) {
    var companiesDiv = document.getElementById('company-list');
    companiesDiv.innerHTML = ''; // Clear any existing content
    companies.forEach(company => {
        var companyDiv = document.createElement('div');
        companyDiv.className = 'company-card';
        companyDiv.innerHTML = `
            <div class="card-image">
                <img src="${company.imagePath}" alt="${company.name}">
            </div>
            <div class="card-content">
                <h3>${company.name}</h3>
                <p class="Founded">Founded in: ${company.createdAt}</p>
                <p class="Specialization">Specialization: ${company.specialization}</p>
                <a href="/#company-details?id=${company.id}">
                    <button>View Details</button>
                </a>
            </div>
        `;
        companiesDiv.appendChild(companyDiv);
    });
}

function displayErrorMessage(message) {
    const companiesDiv = document.getElementById('company-list');
    companiesDiv.innerHTML = `<p class="error-message">${message}</p>`;
}
