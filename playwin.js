(function() {

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
  
      // Initialize a flag to track validation success
      var isValid = true;
  
      // Loop through all form elements to check for required fields
      for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
  
          // Skip the honeypot field if it exists
       if (el.campaign_answer === "veg123") continue;
  
          // Check if the element is required and has a value
          if (el.required && !el.value.trim()) {
              isValid = false;
              // Highlight the invalid field (optional)
              el.style.borderColor = 'red';
              // Show a message for the user (optional)
              if (el.nextElementSibling) {
                  var errorMsg = document.createElement('span');
                  errorMsg.style.color = 'red';
                  errorMsg.textContent = 'This field is required';
                  el.parentNode.appendChild(errorMsg);
              }
          } else {
              el.style.borderColor = '';  // Reset the border color if valid
          }
      }
  
      // If any field is invalid, prevent form submission
      if (!isValid) {
          event.preventDefault();
          return false;
      }
  
      // Show thank you message on successful form submission
      form.querySelector('.thankyou_message').style.display = 'block';
      return true;
  }
  
  // To prevent the error message from showing after the user fixes the input
  document.querySelectorAll("input, textarea").forEach(function(el) {
      el.addEventListener("input", function() {
          el.style.borderColor = '';  // Reset the border color on input
          if (el.nextElementSibling) {
              el.nextElementSibling.remove();  // Remove the error message
          }
      });
  });
  
    // get all data in form and return object
    function getFormData(form) {
      var elements = form.elements;
      var honeypot;
  
      var fields = Object.keys(elements).filter(function(k) {
        if (elements[k].name === "honeypot") {
          honeypot = elements[k].value;
          return false;
        }
        return true;
      }).map(function(k) {
        if(elements[k].name !== undefined) {
          return elements[k].name;
        // special case for Edge's html collection
        }else if(elements[k].length > 0){
          return elements[k].item(0).name;
        }
      }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
      });
  
      var formData = {};
      fields.forEach(function(name){
        var element = elements[name];
        
        // singular form elements just have one value
        formData[name] = element.value;
  
        // when our element has multiple items, get their values
        if (element.length) {
          var data = [];
          for (var i = 0; i < element.length; i++) {
            var item = element.item(i);
            if (item.checked || item.selected) {
              data.push(item.value);
            }
          }
          formData[name] = data.join(', ');
        }
      });
  
      // add form-specific values into the data
      formData.formDataNameOrder = JSON.stringify(fields);
      formData.formGoogleSheetName =  "contactus"; // default sheet name
      formData.formGoogleSendEmail
        = form.dataset.email || ""; // no email by default
  
      return {data: formData, honeypot: honeypot};
    }
  
    function handleFormCSubmit(event) {  // handles form submit without any jquery
  
  
  
      event.preventDefault(); 
      var form = event.target;
  
      var answerField = form.querySelector('[name="campaign_answer"]'); // Get the answer field
   
      // Check if the answer is correct
      var userAnswer = answerField.value.trim().toLowerCase(); // Get the answer and convert it to lowercase for case-insensitive comparison
      if ( userAnswer !== "veg123") {
          alert("Please enter the correct code.");
          return; // Return early if the answer is incorrect
      }
      // we are submitting via xhr below
      var form = event.target;
      var formData = getFormData(form)
      var data = formData.data;
  
      // If a honeypot field is filled, assume it was done so by a spam bot.
      if (formData.honeypot) {
        return false;
      }
  
      disableAllButtons(form);
      var url = form.action;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            form.reset();
            var formElements = form.querySelector(".form-elements")
            if (formElements) {
              formElements.style.display = "none"; // hide form
            }
            var thankYouMessage = form.querySelector(".thankyou_message");
            if (thankYouMessage) {
              thankYouMessage.style.display = "block";
            }
          }
      };
      // url encode form data for sending as post data
      var encoded = Object.keys(data).map(function(k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      }).join('&');
      xhr.send(encoded);
    }
    
    function loaded() {
      // bind to the submit event of our form
      var forms = document.querySelectorAll("form.cform");
      for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener("csubmit", handleFormCSubmit, false);
      }
    };
    document.addEventListener("DOMContentLoaded", loaded, false);
  
    function disableAllButtons(form) {
      var buttons = form.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    }
  })();
  