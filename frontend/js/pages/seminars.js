document.addEventListener("DOMContentLoaded", () => {
    const BASE_API_URL = (
        window.BASE_API_URL
        || window.__ENV__?.BASE_API_URL
        || ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "http://localhost:5000"
            : "https://finedu-api.onrender.com")
    ).replace(/\/$/, "");

    const seminarDateISO = "2026-03-20T13:30:00Z";
    const seminarDurationMinutes = 90;
    const seminarTitle = "FinEdu Live Seminar: Market Cycles and Risk Control";
    const seminarDetails = "Expert-led session on risk management, asset allocation, and practical decision frameworks.";
    const seminarLocation = "Online Zoom Session";

    const form = document.getElementById("seminar-register-form");
    const confirmation = document.getElementById("seminar-confirmation");
    const liveSection = document.getElementById("seminar-live");
    const seminarId = "seminar_001";
    const submitBtn = document.getElementById("seminar-submit-btn");
    const nameInput = document.getElementById("seminar-name");
    const emailInput = document.getElementById("seminar-email");
    const phoneInput = document.getElementById("seminar-phone");
    const experienceInput = document.getElementById("seminar-experience");
    const registerFeedback = document.getElementById("seminar-register-feedback");
    const replaySection = document.getElementById("seminar-replay");
    const googleCalendarLink = document.getElementById("seminar-calendar-google");
    const outlookCalendarLink = document.getElementById("seminar-calendar-outlook");
    const icsCalendarLink = document.getElementById("seminar-calendar-ics");
    const seminarDateText = document.getElementById("seminar-date-text");
    const countdownText = document.getElementById("seminar-countdown");
    const seatsText = document.getElementById("seminar-seats-text");
    const seatsBar = document.getElementById("seminar-seats-bar");
    const upcomingTrack = document.getElementById("upcomingCarouselTrack");
    const carouselPrev = document.getElementById("seminarCarouselPrev");
    const carouselNext = document.getElementById("seminarCarouselNext");
    const notifyForm = document.getElementById("seminar-notify-form");
    const notifyEmailInput = document.getElementById("seminar-notify-email");
    const notifyMessage = document.getElementById("seminar-notify-message");
    const summaryButtons = document.querySelectorAll(".past-summary-btn");
    const successPopup = document.getElementById("seminar-success-popup");
    const successPopupClose = document.getElementById("seminar-success-close");

    const seminarStart = new Date(seminarDateISO);
    const seminarEnd = new Date(seminarStart.getTime() + seminarDurationMinutes * 60 * 1000);
    const isPastSeminar = seminarStart.getTime() < Date.now();
    const totalSeats = 100;
    const seatsLeft = 18;

    const upcomingSeminars = [
        {
            title: "Macro Signals for Swing Traders",
            dateISO: "2026-04-06T13:30:00Z",
            mode: "Live Online"
        },
        {
            title: "ETF Portfolio Construction Bootcamp",
            dateISO: "2026-04-15T13:30:00Z",
            mode: "Live Online"
        },
        {
            title: "Options Hedging for Beginners",
            dateISO: "2026-04-23T13:30:00Z",
            mode: "Live Online"
        },
        {
            title: "Debt Allocation and Rate Cycle Playbook",
            dateISO: "2026-05-05T13:30:00Z",
            mode: "Live Online"
        },
        {
            title: "Behavioral Finance in Real Portfolios",
            dateISO: "2026-05-18T13:30:00Z",
            mode: "Live Online"
        }
    ];
    let carouselStartIndex = 0;
    const carouselVisibleCount = 3;

    const formatForGoogle = (date) => {
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const d = String(date.getUTCDate()).padStart(2, "0");
        const hh = String(date.getUTCHours()).padStart(2, "0");
        const mm = String(date.getUTCMinutes()).padStart(2, "0");
        const ss = String(date.getUTCSeconds()).padStart(2, "0");
        return `${y}${m}${d}T${hh}${mm}${ss}Z`;
    };

    const formatForOutlook = (date) => {
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const d = String(date.getUTCDate()).padStart(2, "0");
        const hh = String(date.getUTCHours()).padStart(2, "0");
        const mm = String(date.getUTCMinutes()).padStart(2, "0");
        const ss = String(date.getUTCSeconds()).padStart(2, "0");
        return `${y}-${m}-${d}T${hh}:${mm}:${ss}Z`;
    };

    const createICSContent = () => {
        const uid = `finedu-${seminarStart.getTime()}@finedu.app`;
        const dtStamp = formatForGoogle(new Date());
        return [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//FinEdu//Seminar//EN",
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${dtStamp}`,
            `DTSTART:${formatForGoogle(seminarStart)}`,
            `DTEND:${formatForGoogle(seminarEnd)}`,
            `SUMMARY:${seminarTitle}`,
            `DESCRIPTION:${seminarDetails}`,
            `LOCATION:${seminarLocation}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");
    };

    const formatCountdown = (targetTime) => {
        const diff = targetTime - Date.now();
        if (diff <= 0) {
            return "Session is live now";
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `Starts in: ${days}d ${hours}h ${minutes}m`;
    };

    const renderUpcomingCarousel = () => {
        if (!upcomingTrack) return;

        const currentItems = upcomingSeminars.slice(
            carouselStartIndex,
            carouselStartIndex + carouselVisibleCount
        );

        upcomingTrack.innerHTML = currentItems
            .map((item) => {
                const dateObj = new Date(item.dateISO);
                const dateLabel = `${dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                })} • ${dateObj.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    timeZoneName: "short"
                })}`;

                return `
                    <article class="upcoming-mini-card" role="listitem">
                        <h3>${item.title}</h3>
                        <p class="upcoming-mini-meta">${dateLabel}</p>
                        <p class="upcoming-mini-meta">${item.mode}</p>
                    </article>
                `;
            })
            .join("");
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

    const setRegistrationFeedback = (message, isError = false) => {
        if (!registerFeedback) return;
        registerFeedback.style.color = isError ? "#b91c1c" : "#15803d";
        registerFeedback.textContent = message;
    };

    const lockRegistrationForm = (locked) => {
        if (!form) return;
        const fields = form.querySelectorAll("input, select, button");
        fields.forEach((field) => {
            field.disabled = locked;
        });

        if (submitBtn) {
            submitBtn.textContent = locked ? "Registered" : "Confirm Registration";
        }
    };

    const showSuccessPopup = () => {
        if (!successPopup) return;
        successPopup.hidden = false;
        document.body.style.overflow = "hidden";
    };

    const hideSuccessPopup = () => {
        if (!successPopup) return;
        successPopup.hidden = true;
        document.body.style.overflow = "";
    };

    const getRegistrationEndpoints = () => [`${BASE_API_URL}/api/seminar/register`];

    const submitSeminarRegistration = async (payload) => {
        const endpoints = getRegistrationEndpoints();
        let lastError = new Error("Registration failed. Please try again.");

        for (let i = 0; i < endpoints.length; i += 1) {
            const endpoint = endpoints[i];
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json().catch(() => ({}));
                if (response.ok && result.success) {
                    return result;
                }

                const errorMessage = result.error || result.message || "Registration failed. Please try again.";
                const shouldTryNext = i < endpoints.length - 1 && (response.status === 404 || response.status === 0);
                if (shouldTryNext) {
                    continue;
                }

                throw new Error(errorMessage);
            } catch (error) {
                lastError = error instanceof Error ? error : new Error("Registration failed. Please try again.");
                if (i === endpoints.length - 1) {
                    throw lastError;
                }
            }
        }

        throw lastError;
    };

    if (seminarDateText) {
        seminarDateText.textContent = `${seminarStart.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        })} | ${seminarStart.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
        })}`;
    }

    if (countdownText) {
        countdownText.textContent = formatCountdown(seminarStart.getTime());
        setInterval(() => {
            countdownText.textContent = formatCountdown(seminarStart.getTime());
        }, 60000);
    }

    if (seatsText && seatsBar) {
        const booked = Math.max(0, totalSeats - seatsLeft);
        const pct = Math.max(0, Math.min(100, Math.round((booked / totalSeats) * 100)));
        seatsText.textContent = `${seatsLeft} / ${totalSeats}`;
        seatsBar.style.width = `${pct}%`;
    }

    renderUpcomingCarousel();

    carouselPrev?.addEventListener("click", () => {
        carouselStartIndex = Math.max(0, carouselStartIndex - 1);
        renderUpcomingCarousel();
    });

    carouselNext?.addEventListener("click", () => {
        const maxStart = Math.max(0, upcomingSeminars.length - carouselVisibleCount);
        carouselStartIndex = Math.min(maxStart, carouselStartIndex + 1);
        renderUpcomingCarousel();
    });

    if (replaySection) replaySection.hidden = !isPastSeminar;

    if (googleCalendarLink) {
        const query = new URLSearchParams({
            action: "TEMPLATE",
            text: seminarTitle,
            dates: `${formatForGoogle(seminarStart)}/${formatForGoogle(seminarEnd)}`,
            details: seminarDetails,
            location: seminarLocation
        });

        googleCalendarLink.href = `https://calendar.google.com/calendar/render?${query.toString()}`;
    }

    if (outlookCalendarLink) {
        const query = new URLSearchParams({
            path: "/calendar/action/compose",
            rru: "addevent",
            subject: seminarTitle,
            startdt: formatForOutlook(seminarStart),
            enddt: formatForOutlook(seminarEnd),
            body: seminarDetails,
            location: seminarLocation
        });

        outlookCalendarLink.href = `https://outlook.office.com/calendar/0/deeplink/compose?${query.toString()}`;
    }

    if (icsCalendarLink) {
        const blob = new Blob([createICSContent()], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        icsCalendarLink.href = url;
    }

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = nameInput?.value?.trim() || "";
        const email = emailInput?.value?.trim() || "";
        const phone = phoneInput?.value?.trim() || "";
        const experience = experienceInput?.value || "";

        if (!name || !email || !experience) {
            setRegistrationFeedback("Please fill all required fields.", true);
            return;
        }

        if (!isValidEmail(email)) {
            setRegistrationFeedback("Please enter a valid email address.", true);
            return;
        }

        lockRegistrationForm(true);
        setRegistrationFeedback("Submitting your registration...");

        try {
            await submitSeminarRegistration({
                name,
                email,
                phone,
                experience,
                seminarId
            });

            localStorage.setItem("seminarRegistered", "true");
            setRegistrationFeedback("Registration successful.");
            if (confirmation) {
                confirmation.hidden = false;
                const note = confirmation.querySelector("p");
                if (note) {
                    note.textContent = "Your seat is reserved. You can now access the live join section below.";
                }
            }
            if (liveSection) liveSection.hidden = false;
            showSuccessPopup();
        } catch (error) {
            lockRegistrationForm(false);
            setRegistrationFeedback(error.message || "Unable to complete registration right now.", true);
        }
    });

    successPopupClose?.addEventListener("click", hideSuccessPopup);
    successPopup?.addEventListener("click", (event) => {
        if (event.target === successPopup) {
            hideSuccessPopup();
        }
    });

    summaryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".past-seminar-card");
            const summary = card?.querySelector(".past-summary");
            const text = button.getAttribute("data-summary") || "Summary not available.";
            if (!summary) return;

            const currentlyHidden = summary.hasAttribute("hidden");
            if (currentlyHidden) {
                summary.textContent = text;
                summary.removeAttribute("hidden");
                button.textContent = "Hide Summary";
            } else {
                summary.setAttribute("hidden", "");
                button.textContent = "View Summary";
            }
        });
    });

    notifyForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = notifyEmailInput?.value?.trim();

        if (!email || !email.includes("@")) {
            if (notifyMessage) {
                notifyMessage.style.color = "#b91c1c";
                notifyMessage.textContent = "Please enter a valid email address.";
            }
            return;
        }

        if (notifyMessage) {
            notifyMessage.style.color = "#15803d";
            notifyMessage.textContent = "You are subscribed. We will notify you about upcoming seminars.";
        }

        localStorage.setItem("seminarNotifyEmail", email);
        notifyForm.reset();
    });
});
