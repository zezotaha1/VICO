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
      debugger;
      console.log("User cookie found:", userCookie);
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

// Function to check if the user is allowed to navigate to a path based on their role
function checkIfAllowedToNavigate(pathname, userRole) {
  // Define paths that are restricted for users
  const notAllowedPaths = ['/admin.html', '/CompaniesView.html', '/companyManage.html', '/companyUsers.html'];

  // Check if the user role is 'user' and if the path is restricted
  if (userRole != 'admin' && notAllowedPaths.includes(pathname)) {
    return false; // Deny navigation if path is restricted for the user
  }
  
  return true; // Allow navigation for other paths
}

// Example: Function to handle pathname change
function handlePathnameChange() {
  const pathname = window.location.pathname;
  const userRole = getUserRole(); // Get the current user role from the cookie

  if (!checkIfAllowedToNavigate(pathname, userRole)) {
    showError('You are not allowed to go to this page.');
    // Redirect to a safe page (e.g., home page)
    window.location.href = '/#home';
  }
}

// Function to get the user role from the cookie
function getUserRole() {
  try {
    const cookie = JSON.parse(document.cookie.split('; ').find(row => row.startsWith('user=')));
    return cookie.role;
  } catch (error) {
    console.error('Error parsing user cookie or not login:', error);
    return ''; // Return an empty string if the cookie is not found
  }
}

// Event listener for pathname changes (e.g., back/forward navigation)
window.onpopstate = function(event) {
  handlePathnameChange();
};

// Optionally, listen for hash changes (if you're using hash-based routing)
window.addEventListener('hashchange', function() {
  handlePathnameChange();
});

// Run the check when the page initially loads
handlePathnameChange();
