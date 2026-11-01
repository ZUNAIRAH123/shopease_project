// Form validation helpers.
// Each validate function returns an object of errors, e.g. { email: "Email is required" }.
// An empty object means the form is valid.

export function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function validateLogin(form) {
  const errors = {};

  if (form.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!isValidEmail(form.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (form.password === "") {
    errors.password = "Password is required";
  }

  return errors;
}

export function validateSignup(form) {
  const errors = {};

  if (form.name.trim() === "") {
    errors.name = "Full name is required";
  }

  if (form.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!isValidEmail(form.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (form.password === "") {
    errors.password = "Password is required";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (form.confirmPassword === "") {
    errors.confirmPassword = "Please confirm your password";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateCheckout(form) {
  const errors = {};

  if (form.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (form.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!isValidEmail(form.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (form.phone.trim() === "") {
    errors.phone = "Phone number is required";
  } else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  if (form.address.trim() === "") {
    errors.address = "Shipping address is required";
  }

  if (form.city.trim() === "") {
    errors.city = "City is required";
  }

  // Card fields are only checked when the customer chose "Card"
  if (form.paymentMethod === "Card") {
    const cardDigits = form.cardNumber.replace(/\s/g, "");
    if (!/^[0-9]{16}$/.test(cardDigits)) {
      errors.cardNumber = "Card number must be 16 digits";
    }
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(form.cardExpiry.trim())) {
      errors.cardExpiry = "Use the format MM/YY";
    }
    if (!/^[0-9]{3,4}$/.test(form.cardCvc.trim())) {
      errors.cardCvc = "CVC must be 3 or 4 digits";
    }
  }

  return errors;
}

export function validateProduct(form) {
  const errors = {};

  if (form.name.trim() === "") {
    errors.name = "Product name is required";
  }

  if (form.price === "" || isNaN(Number(form.price))) {
    errors.price = "Price is required";
  } else if (Number(form.price) <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (form.category.trim() === "") {
    errors.category = "Category is required";
  }

  if (form.stock === "" || isNaN(Number(form.stock))) {
    errors.stock = "Stock is required";
  } else if (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
    errors.stock = "Stock must be a whole number (0 or more)";
  }

  if (form.description.trim() === "") {
    errors.description = "Description is required";
  }

  if (form.image.trim() === "") {
    errors.image = "Image URL is required";
  }

  return errors;
}
