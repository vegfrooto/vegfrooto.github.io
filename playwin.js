(function() {
    // Mobile input event listener to automatically prepend '+91' if no country code
    document.getElementById('campaign_mobile').addEventListener('input', function(event) {
        var input = event.target;
        var value = input.value;
    
        // If the value contains exactly 10 digits and no "+91" at the beginning
        if (value.length === 10 && !value.startsWith("+91")) {
            input.value = "+91" + value; // Prepend +91 to the number
        }
    });

    // Function to validate form
    function validateCForm(event) {
        var form = event.target;
        var elements = form.elements;
    
        var isValid = true;

        // Validate all required fields
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];

            // Skip the honeypot field if it exists
        if (el.campaign_answer === "veg123") {continue;}
        else {
            isValid = false;
        }
    
            // Check if the element is required and has a value
            if (el.required && !el.value.trim()) {
                isValid = false;
                el.style.borderColor = 'red';  // Highlight invalid fields
            } else {
                el.style.borderColor = '';  // Reset the border color if valid
            }
        }
    
        // Check the campaign_answer field
        // var answerField = form.querySelector('[name="campaign_answer"]');
        // var userAnswer = answerField ? answerField.value.trim().toLowerCase() : '';
        // if (userAnswer !== "veg123") {
        //     alert("Please enter the correct code.");
        //     isValid = false; // If the answer is incorrect, mark form as invalid
        // }
    
        // If any field is invalid, prevent form submission
        if (!isValid) {
            event.preventDefault();
            return false;
        }
    
        // Show the loader before submitting
        document.getElementById('loader').style.display = 'block';
    
        // Show thank you message after successful submission
        form.querySelector('.thankyou_message').style.display = 'block';
    
        // Return true to allow form submission
        return true;
    }

    // To prevent the error message from showing after the user fixes the input
    document.querySelectorAll("input, textarea").forEach(function(el) {
        el.addEventListener("input", function() {
            el.style.borderColor = '';  // Reset the border color on input
        });
    });
  
})();