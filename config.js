/* ==========================================================================
   NUVORA.AI — SITE CONFIG
   Edit this file to update contact details and site URL sitewide.
   Every page reads from SITE_CONFIG — you never need to hunt through HTML.
   ========================================================================== */

const SITE_CONFIG = {
  siteName: "Nuvora.ai",
  siteShortName: "Nuvora",
  siteUrl: "https://ainovra-ai.github.io/",

  // TODO: replace with your real contact details.
  // These are placeholders on purpose — nothing was invented.
  email: "hello@example.com",
  whatsapp: "+10000000000", // include country code, digits only after "+"

  tagline: "Exploring AI, Technology & Digital Innovation"
};

// Wire up every element that opts in via data-attributes, on every page.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-site-email]").forEach((el) => {
    el.textContent = SITE_CONFIG.email;
    if (el.tagName === "A") el.href = `mailto:${SITE_CONFIG.email}`;
  });

  document.querySelectorAll("[data-site-email-link]").forEach((el) => {
    el.href = `mailto:${SITE_CONFIG.email}`;
  });

  document.querySelectorAll("[data-site-whatsapp-link]").forEach((el) => {
    const digits = SITE_CONFIG.whatsapp.replace(/[^\d]/g, "");
    el.href = `https://wa.me/${digits}`;
  });

  document.querySelectorAll("[data-site-whatsapp]").forEach((el) => {
    el.textContent = SITE_CONFIG.whatsapp;
  });
});
