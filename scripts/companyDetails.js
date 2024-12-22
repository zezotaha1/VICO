document.getElementById("company-details").addEventListener("sectionEnter", async () => {
    try {
        const companyId = getQueryParams(window.location.hash).id;
        const companyDetails = await fetchCompanyDetailsData(companyId);
        if (companyDetails) {
            displayCompanyDetails(companyDetails);
            autoScrollProducts();
        } else {
            showError('Company details could not be loaded. Please try again later.');
        }
    } catch (error) {
        console.error('Error during section enter:', error);
        showError('An error occurred while loading company details. Please try again later.');
    }
});

async function fetchCompanyDetailsData(id) {
    try {
        const response = await fetch(`http://localhost:5500/data/companyDetails${id}.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch company details.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching company details:', error);
        return null; // Return null to indicate failure
    }
}

function displayCompanyDetails(companyDetails) {
    if (!companyDetails) {
        showError('Company details are not available.');
        return;
    }

    document.getElementById('company-details-image').src=companyDetails.imagePath || 'default-logo.png';
    document.getElementById('company-details-name').textContent = companyDetails.name || 'Unknown Company';
    document.getElementById('company-details-location').textContent = companyDetails.address || 'No address available';
    document.getElementById('company-details-description').textContent = companyDetails.description || 'No description available';
    document.getElementById('company-details-workspace-link').href = `./workspace5.html?id=${companyDetails.id}`;

    // Display products
    const productsSection = document.getElementById('product-grid');
    companyDetails.products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.setAttribute('data-name', product.name.toLowerCase());
        productDiv.setAttribute('onclick', `prodctDetails(${product.id})`);
        productDiv.innerHTML = `
            <div class="card-image">
                <img src="${product.imagePath || 'default-product.jpg'}" alt="${product.name}">
            </div>
            <div class="card-content">
                <h3>${product.name}</h3>
                <h3>${product.price || 'Price not available'}</h3>
                <p class="description">${product.description || 'No description available'}</p>
                <button onclick="addToCart(event, ${product.id}, 1)">Buy</button>
            </div>
        `;
        productsSection.appendChild(productDiv);
    });

    // Display job offers
    const jobsSection = document.getElementById('jobs-grid');
    companyDetails.jobOffers.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'container-fluid mt-5 p-4 border bg-muted rounded-5';
        jobDiv.innerHTML = `
        <div class="d-flex justify-content-between m-5">
            <h1>${job.title}</h1>
            <button class="btn btn-secondary" onclick="showJobApplyForm('${job.title}',${job.id})">APPLY</button>
        </div>
        <div class="container p-4 border bg-muted text-dark mt-4 rounded-3">
            <h5>Job Description..</h5>
            <p>${job.location}</p>
            <p>${job.description || 'No description available'}</p>
        </div>`;
        jobsSection.appendChild(jobDiv);
    });
}

function addToCart(event, productId, number) {
    event.stopPropagation();
    let user = document.cookie.split('=')[1] || null;
    if (!user) {
        window.location.href = `./login.html`;
        return; // Exit the function if the user is not logged in
    }

    try {
        // Retrieve the cart from local storage or initialize an empty object if not present
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Check if the product already exists in the cart
        if (cart[productId]) {
            // If it exists, increase the value by the given number
            cart[productId] += number;
        } else {
            // If it does not exist, set the initial value to the given number
            cart[productId] = number;
        }

        // Save the updated cart back to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('There was an issue adding the product to the cart.');
    }
}

// Function to filter products by name
function filterProducts() {
    const searchText = document.getElementById('search-in-products').value.toLowerCase();
    const productCards = document.querySelectorAll('#product-grid .product-card');

    productCards.forEach(productCard => {
        const productName = productCard.getAttribute('data-name');
        if (productName.includes(searchText)) {
            productCard.style.display = 'inline-block'; // Show product
        } else {
            productCard.style.display = 'none'; // Hide product
        }
    });
}

let scrollInterval;
function autoScrollProducts() {
    const productGrid = document.getElementById('product-grid');
    const resetThreshold = productGrid.scrollWidth - productGrid.clientWidth + 150;
    let scrollAmount = 0;
    let scrollSpeed = 5;
    scrollInterval = setInterval(() => {
        productGrid.scrollBy(scrollSpeed, 0);
        scrollAmount += scrollSpeed;
        if (scrollAmount >= resetThreshold || scrollAmount <= 0) {
            scrollSpeed = -scrollSpeed;
        }
    }, 100);
}

function prodctDetails(id) {
    window.location.hash = `#product-details?id=${id}`;
}

document.getElementById("company-details").addEventListener("sectionLeave", () => {
    clearInterval(scrollInterval);
});

// Function to display a general error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv); // Or append to a specific section
}
//co-founder form
document.getElementById('be-cofounder-button').addEventListener('click', () => {
    document.getElementById('cofounder-form-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
});

document.getElementById('close-form').addEventListener('click', () => {
    document.getElementById('cofounder-form-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

document.getElementById('cofounder-form').addEventListener('submit', (event) => {
    debugger;
    event.preventDefault(); // Prevent form from refreshing the page
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const componyId = getQueryParams(window.location.hash).id;
    const userId= JSON.parse(document.cookie.split(';').find(row => row.startsWith('user=')).split("=")[1]).userId;
    console.log('Form Submitted:', { name, email, message,componyId,userId });

    // TODO: Add your logic to handle the form submission, e.g., sending data to the server
    alert('Form submitted successfully!');

    // Reset form and hide modal
    document.getElementById('cofounder-form').reset();
    document.getElementById('cofounder-form-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});
//job apply form
function showJobApplyForm(jobTitle,id) {
    document.getElementById('job-title').value = jobTitle;
    document.getElementById('job-id').value = id;
    document.getElementById('job-apply-modal').style.display = 'block';
    document.getElementById('job-overlay').style.display = 'block';
}

document.getElementById('close-job-form').addEventListener('click', () => {
    document.getElementById('job-apply-modal').style.display = 'none';
    document.getElementById('job-overlay').style.display = 'none';
});

document.getElementById('job-apply-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    const jobTitle = document.getElementById('job-title').value;
    const jobId = document.getElementById('job-id').value;
    const name = document.getElementById('applicant-name').value;
    const email = document.getElementById('applicant-email').value;
    const coverLetter = document.getElementById('cover-letter').value;

    console.log('Job Application Submitted:', { jobTitle,jobId, name, email, coverLetter });

    // TODO: Add your logic to handle form submission, such as sending data to the backend
    alert('Job application submitted successfully!');

    // Reset the form and hide the modal
    document.getElementById('job-apply-form').reset();
    document.getElementById('job-apply-modal').style.display = 'none';
    document.getElementById('job-overlay').style.display = 'none';
});
