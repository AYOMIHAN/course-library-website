// js/login-check.js

document.addEventListener('DOMContentLoaded', () => {
    const matricInput = document.getElementById('matricInput');
    const accessButton = document.getElementById('accessButton');
    const errorMessage = document.getElementById('errorMessage');

    // The hardcoded matric number for access
    const REQUIRED_MATRIC_NO = 'IDD/23/5500'; // Make sure this is EXACTLY what you expect

    // Function to check access
    const checkAccess = () => {
        const enteredMatric = matricInput.value.trim(); // Get value and remove leading/trailing spaces

        // Optional: Convert to uppercase for case-insensitive check if desired
        // const enteredMatric = matricInput.value.trim().toUpperCase();
        // const REQUIRED_MATRIC_NO_UPPER = REQUIRED_MATRIC_NO.toUpperCase();
        // Inside login-check.js, within the checkAccess function:
if (enteredMatric === REQUIRED_MATRIC_NO) {
    // Success: Set a flag in session storage
    sessionStorage.setItem('access_granted_idd235500', REQUIRED_MATRIC_NO); // Store a flag
    errorMessage.style.display = 'none';
    window.location.href = 'all-materials.html'; // Or your desired landing page
} else {
    // ... (existing error handling) ...
}

        if (enteredMatric === REQUIRED_MATRIC_NO) {
            // Success: Redirect to your main content page
            errorMessage.style.display = 'none'; // Hide any error messages
            window.location.href = 'all-materials.html'; // Or 'index.html'
        } else {
            // Failure: Show error message
            errorMessage.style.display = 'block';
            matricInput.value = ''; // Clear input for next attempt
        }

        
    };

    // Add event listener to the button
    accessButton.addEventListener('click', checkAccess);

    // Optional: Allow pressing Enter key to submit
    matricInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            checkAccess();
        }
    });
});