// Full Name Validation
function validateFullName() {
    const fullname = document.getElementById("fullname");
    let nameRegex=new RegExp( /^[a-zA-Z]{3,}( [a-zA-Z]{3,})+$/);
    if(fullname.value.match(nameRegex)){
        clearError(fullname);
        return true;
    }
    showError("fullname", "Full name must be at least 3 characters long and contain only letters and at least two words.");
    return false;
}

// email validation
function validateEmail() {
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if( emailRegex.test(email.value)){
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
    if( complexityRegex.test(password.value)){
        clearError(password);
        return true;
    }
    showError(
        "password",
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return false;
}

// Confirm Password Validation
function validateConfirmPassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password");
    if(password === confirmPassword.value){
        clearError(confirmPassword);
        return true;
    }
    showError("confirm-password", "Passwords do not match.");
    return false;
}

// Birthdate Validation
function validateBirthdate() {
    const birthdate =new Date(document.getElementById("birthdate").value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    if (age<18) {
        showError("birthdate", "You must be at least 18 years old.");
        return false;
    }
    clearError(document.getElementById("birthdate"));
    return true;
}

// Gender Validation
function validateGender() {
    const gender = document.querySelector('input[name="gender"]');
    if (gender.checked) {
        clearError(gender);
        return true;
    }
    showError("gender", "Please select a gender.");
    return false;
}

document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();  // Prevent default form submission

    // Validate all fields
    if (validateFullName() && validateEmail() && validatePasswordComplexity() && validateConfirmPassword() && validateBirthdate() && validateGender()) {
        // Collect form data
        const formData = {
            id: 0, // Assuming the server assigns an ID
            name: document.getElementById("fullname").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            birthdate: new Date(document.getElementById("birthdate").value).toISOString(),
            role : "user"
        };

        // Send data to the API
        try {
            const response = await fetch("http://localhost:5118/api/Users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Sign up successful!");
                // Optionally, redirect or clear the form
                window.location.href = "./login.html";  // Redirect to login page
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.message || "An error occurred during signup."));
            }
        } catch (error) {
            alert("An error occurred while communicating with the server: " + error.message);
        }
    }
});



// Real-time validation
const inputs = document.querySelectorAll("#signupForm input");
inputs.forEach(input => {
    input.addEventListener("input", () => validateField(input));
    input.addEventListener("blur", () => validateField(input));
});

function validateField(input) {
    const id = input.id;
    const value = input.value.trim();

    // Clear existing error
    clearError(input);

    // Validate each field
    if (id === "fullname" ) {
        validateFullName();
    } else if (id === "email") {
        validateEmail();
    } else if (id === "password") {
        validatePasswordComplexity();
    } else if (id === "confirm-password") {
        validateConfirmPassword();
    } else if (id === "birthdate") {
        validateBirthdate();
    } else if (id === "gender") {
        validateGender();
    }
}

// Helper Functions
function clearError(input) {
    var errorMessage ;
    if( input.type=="password")
        errorMessage=input.parentElement.parentElement.querySelector(".error-message");
    else
        errorMessage=input.parentElement.querySelector(".error-message");
    if (errorMessage) {
        errorMessage.style.display = "none";
    }
}

function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    let errorElement = inputElement.parentElement.querySelector(".error-message");
    if(inputId === "password" || inputId === "confirm-password"){
        errorElement = inputElement.parentElement.parentElement.querySelector(".error-message");
    }
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.style.color = "red";
        if(inputId === "password" || inputId === "confirm-password"){
            inputElement.parentElement.parentElement.appendChild(errorElement);
        }
        else{
            
            inputElement.parentElement.appendChild(errorElement);
        }
    }

    errorElement.textContent = message;
    errorElement.style.display = "block";
}


// Password Show/Hide Toggle
var showPasswordIcon = document.getElementById("showPassword");
var passwordInput = document.getElementById("password");

var showConfirmPasswordIcon = document.getElementById("showconfirm-password");
var confirmPasswordInput = document.getElementById("confirm-password");

showPasswordIcon.addEventListener("click", () =>
    togglePasswordVisibility(showPasswordIcon, passwordInput)
);
showConfirmPasswordIcon.addEventListener("click", () =>
    togglePasswordVisibility(showConfirmPasswordIcon, confirmPasswordInput)
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
