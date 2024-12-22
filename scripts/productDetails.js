document.getElementById("product-details").addEventListener("sectionEnter", async () => {
    try {
        const productId = getQueryParams(window.location.hash).id;
        const productDetails = await fetchProductDetailsData(productId);
        if (productDetails) {
            displayProductDetails(productDetails);
        } else {
            showError('Product details could not be loaded. Please try again later.');
        }
    } catch (error) {
        console.error('Error during section enter:', error);
        showError('An error occurred while loading product details. Please try again later.');
    }
});

async function fetchProductDetailsData(id) {
    try {
        const response = await fetch(`http://localhost:5500/data/product${id}.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null; // Return null to indicate failure
    }
}

function displayProductDetails(productDetails) {
    if (!productDetails) {
        showError('Product details are not available.');
        return;
    }

    document.getElementById("productImage").src = productDetails.imagePath || 'default-image.jpg'; // Fallback image
    document.getElementById("productName").innerText = productDetails.name || 'Unknown Product';
    document.getElementById("productDescription").innerText = productDetails.description || 'No description available';

    const rate = document.getElementById("rating");
    rate.innerHTML = ''; // Clear existing rating
    const rating = productDetails.rate || 0; // Default to 0 stars if rate is missing
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            rate.innerHTML += "<i class='fa-solid fa-star checked'></i>";
        } else {
            rate.innerHTML += "<i class='fa-solid fa-star'></i>";
        }
    }
    rate.innerHTML += `  <span>${productDetails.numberOfReviews || 0} Reviews</span>`; // Default to 0 reviews if missing

    document.getElementById("productPrice").innerText = "$" + (productDetails.price || 'N/A');
    document.getElementById("productAddTocart").setAttribute("onclick", `addToCart(event, ${productDetails.id}, 1)`);
}

// Function to display a general error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv); // Or append to a specific section
}

// Function to retrieve query parameters from URL hash
function getQueryParams(hash) {
    const params = {};
    const queryString = hash.split('?')[1];
    if (queryString) {
        const queryArray = queryString.split('&');
        queryArray.forEach(param => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        });
    }
    return params;
}
