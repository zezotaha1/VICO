document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    if (validateEmail() && validatePasswordComplexity()) {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const rememberMe = document.getElementById("remember").checked;

        // Prepare data to send to the server
        const data = { email, password };

        // Send the data to the server
        fetch("http://localhost:5118/api/Users/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server error, please try again.");
            }
            return response.json();
        })
        .then(result => {
            if (result.message === "Login successful") {
                // Save necessary information in cookies
                const userData = {
                    userId: result.userId,
                    name: result.name,
                    email: result.email,
                    role: result.role
                };

                if (rememberMe) {
                    // Set cookies for 1 hour
                    document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=3600; Secure`;
                } else {
                    // Set session cookies (deleted when the browser is closed)
                    document.cookie = `user=${JSON.stringify(userData)}; path=/; Secure`;
                }

                // Redirect to the home page or another appropriate page
                alert("Login successful!");
                if(userData.role=='admin'){
                    window.location.href = "./admin.html";
                }
                else if(userData.role=='user'){
                    window.location.href = "./#home";
                }
            } else {
                showError("email", result.message || "Login failed. Please check your credentials.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showError("email", "Unable to log in. Please try again later.");
        });
    }
});


// email validation
function validateEmail() {
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email.value)) {
        clearError(email);
        return true;
    }
    showError("email", "Please enter a valid email address.");
    return false;
}

// Password Validation: Complexity
function validatePasswordComplexity() {
    const password = document.getElementById("password");
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (complexityRegex.test(password.value)) {
        clearError(password);
        return true;
    }
    showError(
        "password",
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return false;
}

// Helper Functions
function clearError(input) {
    const errorMessage = input.parentElement.parentElement.querySelector(".error-message");
    if (errorMessage) {
        errorMessage.style.display = "none";
    }
}

function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    let errorElement = inputElement.parentElement.parentElement.querySelector(".error-message");
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.style.color = "red";
        errorElement.style.fontSize = "10px";
        errorElement.style.fontWeight = "bold";
        errorElement.style.textAlign = "start";
        errorElement.style.marginBottom = "10px";
        inputElement.parentElement.parentElement.append(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = "block";
}

// Password Show/Hide Toggle
var showPasswordIcon = document.getElementById("showPassword");
var passwordInput = document.getElementById("password");
showPasswordIcon.addEventListener("click", () =>
    togglePasswordVisibility(showPasswordIcon, passwordInput)
);

function togglePasswordVisibility(passwordIcon, passwordField) {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordIcon.textContent = "🙈";
    } else {
        passwordField.type = "password";
        passwordIcon.textContent = "👁️";
    }
}
