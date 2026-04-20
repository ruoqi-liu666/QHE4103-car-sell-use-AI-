const STORAGE_KEYS = {
  users: "veluxe-users",
  cars: "veluxe-cars",
  activeUser: "veluxe-active-user"
};

const seededUsers = [
  { username: "seller01", password: "seller01", name: "Demo Seller" }
];

document.addEventListener("DOMContentLoaded", () => {
  initialiseStorage();

  const page = document.body.dataset.page;
  if (page === "register") setupRegistrationForm();
  if (page === "login") setupLoginForm();
  if (page === "add-car") setupAddCarForm();
});

function initialiseStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(seededUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.cars)) {
    localStorage.setItem(STORAGE_KEYS.cars, JSON.stringify([]));
  }
}

function setupRegistrationForm() {
  const form = document.getElementById("registrationForm");
  const status = document.getElementById("registrationStatus");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    resetStatus(status);

    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const rules = {
      name: {
        valid: /^[A-Za-z\s]+$/.test(values.name.trim()),
        message: "Name can contain letters and spaces only."
      },
      address: {
        valid: /^[A-Za-z0-9\s]+$/.test(values.address.trim()),
        message: "Address can contain letters, numbers, and spaces only."
      },
      phone: {
        valid: /^1[3-9]\d{9}$/.test(values.phone.trim()),
        message: "Phone number must be a valid China mobile number."
      },
      email: {
        valid: /^[^@\s]+@[^@\s]+\.(cn|com)$/.test(values.email.trim()),
        message: "Email must contain exactly one @ and end with .cn or .com."
      },
      username: {
        valid: /^[A-Za-z0-9]{6,}$/.test(values.username.trim()),
        message: "Username must be at least 6 alphanumeric characters."
      },
      password: {
        valid: /^[A-Za-z0-9]{6,}$/.test(values.password.trim()),
        message: "Password must be at least 6 alphanumeric characters."
      }
    };

    const ok = applyValidation(form, rules);
    if (!ok) {
      setStatus(status, "Please correct the highlighted fields before submitting.", false);
      return;
    }

    const users = readStorage(STORAGE_KEYS.users);
    const exists = users.some((user) => user.username.toLowerCase() === values.username.trim().toLowerCase());

    if (exists) {
      setFieldError(form.elements.username, "This username already exists.");
      setStatus(status, "Username already exists. Please choose another one.", false);
      return;
    }

    users.push({
      name: values.name.trim(),
      address: values.address.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      username: values.username.trim(),
      password: values.password.trim()
    });
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    form.reset();
    clearErrors(form);
    setStatus(status, "Seller registration successful. You can now log in with your new account.", true);
  });
}

function setupLoginForm() {
  const form = document.getElementById("loginForm");
  const status = document.getElementById("loginStatus");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    resetStatus(status);

    const username = form.elements.username.value.trim();
    const password = form.elements.password.value.trim();
    const rules = {
      username: {
        valid: username.length > 0,
        message: "Username is required."
      },
      password: {
        valid: password.length > 0,
        message: "Password is required."
      }
    };

    const ok = applyValidation(form, rules);
    if (!ok) {
      setStatus(status, "Please enter both username and password.", false);
      return;
    }

    const users = readStorage(STORAGE_KEYS.users);
    const matchedUser = users.find((user) => user.username === username && user.password === password);

    if (!matchedUser) {
      setStatus(status, "Login failed. Check your username and password.", false);
      return;
    }

    localStorage.setItem(STORAGE_KEYS.activeUser, matchedUser.username);
    clearErrors(form);
    setStatus(status, `Login successful. Welcome back, ${matchedUser.username}.`, true);
  });
}

function setupAddCarForm() {
  const form = document.getElementById("addCarForm");
  const status = document.getElementById("addCarStatus");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    resetStatus(status);

    const activeUser = localStorage.getItem(STORAGE_KEYS.activeUser);
    if (!activeUser) {
      setStatus(status, "Please log in before publishing a car listing.", false);
      return;
    }

    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const currentYear = new Date().getFullYear() + 1;
    const rules = {
      colour: {
        valid: values.colour.trim().length >= 2,
        message: "Colour is required."
      },
      model: {
        valid: values.model.trim().length >= 2,
        message: "Model is required."
      },
      year: {
        valid: /^\d{4}$/.test(values.year) && Number(values.year) >= 1990 && Number(values.year) <= currentYear,
        message: `Year must be between 1990 and ${currentYear}.`
      },
      location: {
        valid: values.location.trim().length >= 2,
        message: "Location is required."
      },
      price: {
        valid: Number(values.price) > 0,
        message: "Price must be a positive number."
      },
      image: {
        valid: values.image.trim() === "" || /^https?:\/\/.+/i.test(values.image.trim()),
        message: "Image must be a valid URL if provided."
      }
    };

    const ok = applyValidation(form, rules);
    if (!ok) {
      setStatus(status, "Please fix the listing form before publishing.", false);
      return;
    }

    const cars = readStorage(STORAGE_KEYS.cars);
    const id = `car-${Date.now()}`;
    const model = values.model.trim();
    const colour = values.colour.trim();

    cars.unshift({
      id,
      model,
      year: Number(values.year),
      colour,
      location: values.location.trim(),
      price: Number(values.price),
      image: values.image.trim() || buildCarSvg(model, colour),
      seller: activeUser
    });

    localStorage.setItem(STORAGE_KEYS.cars, JSON.stringify(cars));
    form.reset();
    clearErrors(form);
    setStatus(status, "Vehicle published successfully for the logged-in seller.", true);
  });
}

function applyValidation(form, rules) {
  let valid = true;
  clearErrors(form);

  Object.entries(rules).forEach(([name, rule]) => {
    const field = form.elements[name];
    if (!rule.valid) {
      setFieldError(field, rule.message);
      valid = false;
    }
  });

  return valid;
}

function clearErrors(form) {
  form.querySelectorAll(".field").forEach((field) => field.classList.remove("is-invalid"));
  form.querySelectorAll(".error-message").forEach((item) => {
    item.textContent = "";
  });
}

function setFieldError(input, message) {
  const wrapper = input.closest(".field");
  if (!wrapper) return;
  wrapper.classList.add("is-invalid");
  const messageNode = wrapper.querySelector(".error-message");
  if (messageNode) messageNode.textContent = message;
}

function setStatus(node, message, success) {
  node.textContent = message;
  node.classList.toggle("is-success", success);
  node.classList.toggle("is-error", !success);
}

function resetStatus(node) {
  node.textContent = "";
  node.classList.remove("is-success", "is-error");
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    return [];
  }
}

function buildCarSvg(model, colour) {
  const safeModel = escapeHtml(model);
  const safeColour = escapeHtml(colour);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 825">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111111"/>
          <stop offset="100%" stop-color="#3a3a3a"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="825" fill="url(#bg)"/>
      <rect x="75" y="78" width="1050" height="669" rx="36" fill="#f7f7f5" opacity="0.08"/>
      <text x="110" y="160" fill="#c9a96b" font-size="40" font-family="Arial, sans-serif" letter-spacing="4">VELUXE MOTORS</text>
      <text x="110" y="240" fill="#ffffff" font-size="78" font-family="Arial, sans-serif" font-weight="700">${safeModel}</text>
      <text x="110" y="305" fill="#d9d9d9" font-size="36" font-family="Arial, sans-serif">${safeColour}</text>
      <rect x="150" y="460" width="900" height="110" rx="55" fill="#1f1f1f"/>
      <rect x="250" y="370" width="460" height="120" rx="50" fill="#ffffff" opacity="0.92"/>
      <rect x="640" y="385" width="220" height="90" rx="36" fill="#e5e5e5"/>
      <circle cx="320" cy="600" r="80" fill="#111111"/>
      <circle cx="880" cy="600" r="80" fill="#111111"/>
      <circle cx="320" cy="600" r="34" fill="#c9a96b"/>
      <circle cx="880" cy="600" r="34" fill="#c9a96b"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
