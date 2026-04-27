document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear previous errors
      clearErrors();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      let isValid = true;

      // Username validation: at least 6 alphanumeric characters
      if (!username) {
        showError('username', 'Username is required');
        isValid = false;
      } else if (!/^[a-zA-Z0-9]{6,}$/.test(username)) {
        showError('username', 'Username must be at least 6 alphanumeric characters');
        isValid = false;
      }

      // Password validation: at least 6 alphanumeric characters
      if (!password) {
        showError('password', 'Password is required');
        isValid = false;
      } else if (!/^[a-zA-Z0-9]{6,}$/.test(password)) {
        showError('password', 'Password must be at least 6 alphanumeric characters');
        isValid = false;
      }

      if (isValid) {
        // For demo purposes, simulate successful login
        // In real app, this would send to server
        alert('Login successful! Welcome back, ' + username);
        // Redirect to homepage or seller dashboard
        // window.location.href = 'index.html';
      }
    });
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');

    if (field) {
      field.classList.add('error');
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  function clearErrors() {
    const errorInputs = document.querySelectorAll('.form-input.error');
    const errorMessages = document.querySelectorAll('.error-message.show');

    errorInputs.forEach(input => input.classList.remove('error'));
    errorMessages.forEach(msg => msg.classList.remove('show'));
  }
});
