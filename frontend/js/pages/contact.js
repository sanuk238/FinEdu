document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("contact-feedback");
  const submitBtn = document.getElementById("contact-submit");

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const setFeedback = (message, isError = false) => {
    if (!feedback) return;
    feedback.style.color = isError ? "#b91c1c" : "#15803d";
    feedback.textContent = message;
  };

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = String(document.getElementById("contact-name")?.value || "").trim();
    const email = String(document.getElementById("contact-email")?.value || "").trim();
    const subject = String(document.getElementById("contact-subject")?.value || "").trim();
    const message = String(document.getElementById("contact-message")?.value || "").trim();

    if (!name || !email || !subject || !message) {
      setFeedback("Please fill all required fields.", true);
      return;
    }

    if (!isValidEmail(email)) {
      setFeedback("Please enter a valid email address.", true);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sent";
    }

    setFeedback("Thank you for contacting FinEdu. Your message has been received.");
    form.reset();
  });
});
