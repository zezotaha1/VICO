const links = document.querySelectorAll("[data-page]");
const contentArea = document.getElementById("content");

// Function to load content dynamically
const loadContent = (page) => {
  fetch(`pages/${page}.html`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Page not found");
      }
      return response.text();
    })
    .then((html) => {
      contentArea.innerHTML = html;
    })
    .catch((error) => {
      contentArea.innerHTML = `<h2>Error</h2><p>${error.message}</p>`;
    });
};

// Add event listeners to the links
links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const page = link.getAttribute("data-page");
    loadContent(page);
  });
});

// Load summary page when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadContent("summary");
});
