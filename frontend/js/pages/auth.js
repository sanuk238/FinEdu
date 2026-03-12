document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("authForm");
  const title = document.getElementById("authTitle");
  const subtitle = document.getElementById("authSubtitle");
  const submitBtn = document.getElementById("authSubmitBtn");
  const switchPrefix = document.getElementById("authSwitchPrefix");
  const switchBtn = document.getElementById("authSwitchBtn");
  const passwordInput = document.getElementById("authPassword");
  const passwordToggle = document.getElementById("authPasswordToggle");
  const emailInput = document.getElementById("authEmail");
  const nameInput = document.getElementById("authName");
  const nameField = document.getElementById("authNameField");
  const authMessage = document.getElementById("authMessage");

  let isLogin = true;
  let isLoading = false;

  const API_BASE =
    window.BASE_API_URL ||
    window.__ENV__?.BASE_API_URL ||
    ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:5000"
      : "https://finedu-backend-i4fm.onrender.com");
  const BASE_API_URL = API_BASE.replace(/\/$/, "");

  const setAuthFlashMessage = (message, type = "success") => {
    if (!message) return;
    try {
      sessionStorage.setItem("finedu_auth_flash", JSON.stringify({ message, type }));
    } catch (e) {
      // Ignore storage failures gracefully.
    }
  };

  const setMessage = (message, type = "info") => {
    if (!authMessage) return;
    authMessage.textContent = message || "";
    authMessage.classList.remove("is-error", "is-success");
    if (type === "error") authMessage.classList.add("is-error");
    if (type === "success") authMessage.classList.add("is-success");
  };

  const setLoading = (loading) => {
    isLoading = loading;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading
      ? (isLogin ? "Signing In..." : "Creating Account...")
      : (isLogin ? "Sign In" : "Create Account");
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

  const updatePasswordToggleState = () => {
    if (!passwordInput || !passwordToggle) return;
    const isVisible = passwordInput.type === "text";
    passwordToggle.textContent = isVisible ? "Hide" : "Show";
    passwordToggle.setAttribute("aria-label", isVisible ? "Hide password" : "Show password");
    passwordToggle.setAttribute("aria-pressed", isVisible ? "true" : "false");
  };

  const renderState = () => {
    setMessage("");
    if (isLogin) {
      document.title = "FinEdu - Login";
      title.textContent = "Sign in to your FinEdu account";
      subtitle.textContent = "Continue your journey to smarter investing with guided lessons and practical tools.";
      switchPrefix.textContent = "DonΓÇÖt have an account?";
      switchBtn.textContent = "Sign Up";
      nameField.classList.add("auth-hidden");
    } else {
      document.title = "FinEdu - Sign Up";
      title.textContent = "Create your FinEdu account";
      subtitle.textContent = "Start learning investing fundamentals, build practical confidence, and track your progress.";
      switchPrefix.textContent = "Already have an account?";
      switchBtn.textContent = "Login";
      nameField.classList.remove("auth-hidden");
    }

    setLoading(false);
    updatePasswordToggleState();
  };

  const validateForm = () => {
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const name = (nameInput?.value || "").trim();

    if (!email || !password) {
      return { ok: false, message: "Email and password are required." };
    }

    if (!isValidEmail(email)) {
      return { ok: false, message: "Please enter a valid email address." };
    }

    if (password.length < 8) {
      return { ok: false, message: "Password must be at least 8 characters long." };
    }

    if (!isLogin && name.length < 2) {
      return { ok: false, message: "Please enter your full name." };
    }

    return { ok: true, data: { email, password, name } };
  };

  const saveAuth = (payload) => {
    localStorage.setItem("finedu_auth_token", payload.token);
    localStorage.setItem("finedu_auth_user", JSON.stringify(payload.user || {}));
  };

  const handleAuthSubmit = async () => {
    if (isLoading) return;

    const validation = validateForm();
    if (!validation.ok) {
      setMessage(validation.message, "error");
      return;
    }

    const { email, password, name } = validation.data;
    const endpoint = isLogin ? "/api/login" : "/api/signup";
    const requestBody = isLogin ? { email, password } : { name, email, password };

    try {
      setMessage("");
      setLoading(true);

      const response = await fetch(`${BASE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Authentication failed. Please try again.");
      }

      saveAuth(result);
      setMessage(isLogin ? "Login successful." : "Account created successfully.", "success");
      setAuthFlashMessage(isLogin ? "Login successful." : "Account created successfully.", "success");

      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  switchBtn.addEventListener("click", () => {
    isLogin = !isLogin;
    renderState();
  });

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
      updatePasswordToggleState();
    });
  }

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleAuthSubmit();
  });

  renderState();
});
