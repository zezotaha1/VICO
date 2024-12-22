// Select all sections and hide them initially
const sections = document.querySelectorAll("main > section");
sections.forEach((section) => (section.style.display = "none"));

// Function to parse query parameters
function getQueryParams(url) {
  const queryString = url.split("?")[1];
  const params = {};
  if (queryString) {
    queryString.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
  }
  return params;
}

// Function to navigate between routes
function navigate() {
  const hash = window.location.hash.split("?")[0] || "#home"; // Default route

  sections.forEach((section) => {
    if (`#${section.id}` === hash) {
      section.style.display = "block";
      const event = new Event("sectionEnter");
      section.dispatchEvent(event);
    } else {
      section.style.display = "none";
      const event = new Event("sectionLeave");
      section.dispatchEvent(event);
    }
  });
}

// Listen to hash changes
window.addEventListener("hashchange", navigate);

// Navigate to the initial route on page load
window.addEventListener("load", navigate);
window.addEventListener("load", changeLoginToCart);

// Change login state to cart icon based on user cookie
function changeLoginToCart() {
  const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));

  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie.split('=')[1]);
      // Hide Sign-In/Login buttons
      document.getElementById("authButtons").classList.add("d-none");
      // Show profile and cart icons
      document.getElementById("userIcons").classList.remove("d-none");
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      showError("Failed to retrieve user data.");
    }
  } else {
    // If no user cookie, ensure buttons are visible and icons are hidden
    document.getElementById("authButtons").classList.remove("d-none");
    document.getElementById("userIcons").classList.add("d-none");
  }
};

// Logout Function
function logout() {
  // Delete cookies by setting them to expire in the past
  document.cookie = "user=; path=/; max-age=0; Secure";

  // Optionally redirect to the login page or home page
  window.location.href = "./login.html"; // Redirect to login page
}

// Function to display a general error message
function showError(message) {
  alert(message); // Consider improving with a more user-friendly UI for errors (e.g., modal or toast)
}
