var cart;

// Initial render of products and cart
document.getElementById('cart').addEventListener('sectionEnter', async () => {
    cart = JSON.parse(localStorage.getItem('cart')) || {}; // Default to empty cart if not found
    if (Object.keys(cart).length === 0) {
        renderEmptyCart();
    } else {
        try {
            const products = await renderProducts();
            renderCart(products);
        } catch (error) {
            console.error('Error rendering products:', error);
            renderErrorMessage('Failed to load cart products.');
        }
    }
});

// Function to render products dynamically
async function renderProducts() {
    var products = [];
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous product list

    for (var key in cart) {
        try {
            var product = await fetchProductDetailsData(key);
            if (product) {
                products.push(product);
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.imagePath}" alt="${product.name}">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${product.price}</div>
                    <button class="btn" onclick="addToCart('${product.name}', ${product.price}, ${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productCard);
            }
        } catch (error) {
            console.error('Error fetching product details for product ID:', key, error);
            showError('Error fetching product details for product ID:', key, error.message);
        }
    }
    return products;
}

// Function to render cart items dynamically
function renderCart(products) {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    products.forEach(item => {
        const subtotal = item.price * cart[item.id];
        total += subtotal;
        cartItems.innerHTML += `
            <div class="cart-item">${item.name} - $${item.price.toFixed(2)} x ${cart[item.id]} = $${subtotal.toFixed(2)}</div>
        `;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Function to handle empty cart
function renderEmptyCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '<p>Your cart is empty</p>';
    cartTotal.textContent = '$0.00';
}

// Function for checkout
function checkout() {
    const paymentMethod = document.getElementById('payment-method').value;
    if (!paymentMethod) {
        alert('Please select a payment method!');
        return;
    }

    alert(`Checkout complete! Payment method: ${paymentMethod}`);
    localStorage.removeItem('cart'); // Clear cart after checkout
    renderEmptyCart(); // Optionally, reset the cart view after checkout
}

// Function to toggle cart visibility
function showCart() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.style.display = cartContainer.style.display === 'block' ? 'none' : 'block';
}

// Fetch product details function (assuming this function already exists)
async function fetchProductDetailsData(id) {
    try {
        const response = await fetch(`http://localhost:5500/data/product${id}.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching product details:', error);
        showError(`Failed to fetch product id${id} details. Please try again later.`);
        return null; // Return null if product details can't be fetched
    }
}

// Function to display error message if something goes wrong
function renderErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.innerHTML = `<p class="error-message">${message}</p>`;
}
