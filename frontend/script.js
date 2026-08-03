const API_BASE = "https://dutyup.onrender.com";

const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

function updateHeader() {
  const navOpen = siteNav.classList.contains("active");
  const scrolled = window.scrollY > 0;

  header.classList.toggle("scrolled", scrolled || navOpen);
}

window.addEventListener("scroll", updateHeader);

navToggle.addEventListener("click", () => {
  siteNav.classList.toggle("active");
  updateHeader();
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("active");
    updateHeader();
  });
});

const dialog = document.getElementById("sign-dialog");

document.getElementById("sign-dialog-open").addEventListener("click", () => {
  dialog.showModal();
  document.body.classList.add("no-scroll");
});

document
  .getElementById("sign-dialog-close")
  .addEventListener("click", closeDialog);

dialog.addEventListener("click", (e) => {
  const r = dialog.getBoundingClientRect();
  const outside =
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom;
  if (outside) closeDialog();
});

function closeDialog() {
  dialog.close();
  document.body.classList.remove("no-scroll");
}

function setupEventDialog(id) {
  const dlg = document.getElementById(`event-dialog-${id}`);

  document.getElementById(`event-dialog-${id}-open`)
    .addEventListener("click", () => {
      dlg.showModal();
      document.body.classList.add("no-scroll");
    });

  document.getElementById(`event-dialog-${id}-close`)
    .addEventListener("click", () => {
      dlg.close();
      document.body.classList.remove("no-scroll");
    });

  dlg.addEventListener("click", (e) => {
    const r = dlg.getBoundingClientRect();
    const outside =
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom;
    if (outside) {
      dlg.close();
      document.body.classList.remove("no-scroll");
    }
  });
}

["01", "02", "03", "04", "05"].forEach(setupEventDialog);

function updateCounter(count) {
  document.querySelectorAll(".live-count").forEach((el) => {
    el.textContent = count.toLocaleString();
  });
}

async function fetchCount() {
  try {
    const res = await fetch(`${API_BASE}/api/count`);
    if (!res.ok) throw new Error();
    const { count } = await res.json();
    updateCounter(count);
  } catch {}
}

fetchCount();
setInterval(fetchCount, 10_000);

const signForm = dialog.querySelector(".sign-form");

signForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = signForm.querySelector(".form-input-name").value.trim();
  const email = signForm.querySelector(".form-input-email").value.trim();
  const btn = signForm.querySelector("button[type='submit']");

  if (!name || !email) return;

  btn.disabled = true;
  btn.textContent = "Signing…";

  try {
    const res = await fetch(`${API_BASE}/api/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();

    if (typeof data.count === "number") updateCounter(data.count);

    if (data.error === "already_signed") {
      showMsg("⚠️ Cet email a déjà signé la pétition.", "warning");
      btn.disabled = false;
      btn.textContent = "Sign Now";
    } else if (data.success) {
      closeDialog();
      setTimeout(() => {
        window.location.href = data.redirect;
      }, 800);
    } else {
      showMsg("❌ Une erreur est survenue. Réessaie.", "error");
      btn.disabled = false;
      btn.textContent = "Sign Now";
    }
  } catch {
    showMsg("❌ Problème réseau. Vérifie ta connexion.", "error");
    btn.disabled = false;
    btn.textContent = "Sign Now";
  }
});

function showMsg(text, type) {
  signForm.querySelector(".form-message")?.remove();
  const p = document.createElement("p");
  p.className = `form-message form-message--${type}`;
  p.textContent = text;
  signForm.insertBefore(p, signForm.querySelector("button[type='submit']"));
  setTimeout(() => p.remove(), 4000);
}

ScrollReveal().reveal(".sr-wrapper-top", {
  interval: 250,
  distance: "50px",
  origin: "top",
  opacity: 0,
  easing: "ease-in-out",
  reset: true,
});

ScrollReveal().reveal(".sr-wrapper-bottom", {
  interval: 250,
  distance: "50px",
  origin: "bottom",
  opacity: 0,
  easing: "ease-in-out",
  reset: true,
});

ScrollReveal().reveal(".sr-wrapper-left", {
  interval: 250,
  distance: "50px",
  origin: "left",
  opacity: 0,
  easing: "ease-in-out",
  reset: true,
});

ScrollReveal().reveal(".sr-wrapper-right", {
  interval: 250,
  distance: "50px",
  origin: "right",
  opacity: 0,
  easing: "ease-in-out",
  reset: true,
});
