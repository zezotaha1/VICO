var cart;
// Initial render of products and cart
document.getElementById('cart').addEventListener('sectionEnter', async () => {
    cart = JSON.parse(localStorage.getItem('cart'));
    var products= await renderProducts();
    renderCart(products);
});
// Example product data, this can be replaced with a real data fetch (from API or database)

// Function to render products dynamically
async function renderProducts() {
    var products=new Array();
    const productList = document.getElementById('product-list');
    for(var key in cart) {
        var product= await fetchProductDetailsData(key);
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
    };
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

// Function for checkout
function checkout() {
    const paymentMethod = document.getElementById('payment-method').value;
    if (!paymentMethod) {
        alert('Please select a payment method!');
        return;
    }

    alert(`Checkout complete! Payment method: ${paymentMethod}`);
    localStorage.removeItem('cart'); // Clear cart after checkout
}


// Function to toggle cart visibility
function showCart() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.style.display = cartContainer.style.display === 'block' ? 'none' : 'block';
}