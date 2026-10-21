const $ = (id) => document.getElementById(id);
const baseProfile = window.PROFILE;
const routes = new Set(["profile", "socials", "company", "gallery", "products"]);
const socialNames = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn", tiktok: "TikTok" };
const profile = JSON.parse(JSON.stringify(baseProfile));

const paths = {
  save: '<circle cx="9" cy="6" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M19 8v10m-3-3 3 3 3-3"/>',
  phone: '<path d="m7 3 3 5-3 2a14 14 0 0 0 7 7l2-3 5 3-1 4C11 23 1 13 3 4Z"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  whatsapp: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M12 2a10 10 0 0 0-8.64 15.04L2 22l5.1-1.34A10 10 0 1 0 12 2Zm0 1.85a8.15 8.15 0 0 1 0 16.3 8.1 8.1 0 0 1-4.16-1.14l-.35-.21-2.84.75.76-2.77-.23-.37A8.15 8.15 0 0 1 12 3.85Z"/><path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.62.71.23 1.35.2 1.86.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/>',
  facebook: '<path fill="currentColor" stroke="none" d="M14.4 22v-8.6h2.9l.4-3.4h-3.3V7.8c0-1 .3-1.7 1.7-1.7h1.8V3.2c-.3 0-1.4-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5V10H8v3.4h2.9V22Z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 6h.01"/>',
  linkedin: '<circle cx="5" cy="5" r="1.2" fill="currentColor"/><path d="M5 9v11M10 20V9m0 5c0-6 9-6 9 0v6" stroke-width="3"/>',
  tiktok: '<path d="M14 3v12a4 4 0 1 1-4-4M14 3c1 4 3 5 6 5" stroke-width="2.7"/>',
  "arrow-up-right": '<path d="M6 18 18 6M6 6h12v12"/>',
  "chevron-up": '<path d="m6 15 6-6 6 6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
};
function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.globe}</svg>`;
}
document.querySelectorAll("[data-icon]").forEach((element) => { element.innerHTML = icon(element.dataset.icon); });

function webUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}
function imageUrl(value) {
  if (typeof value !== "string") return "";
  if (/^assets\/[\w.-]+\.(png|jpe?g|webp|svg|avif)$/i.test(value)) return value;
  if (/^data:image\/(png|jpe?g|webp|avif|gif);base64,/i.test(value)) return value;
  return webUrl(value);
}
const digits = (value) => String(value || "").replace(/\D/g, "");
const phoneValue = (value) => String(value || "").replace(/[^\d+]/g, "");
function whatsappUrl(value) {
  let number = digits(value);
  if (number.length === 10 && number.startsWith("0")) number = "94" + number.slice(1);
  return number ? `https://wa.me/${number}` : "";
}
function domain(value, prefix = false) {
  try { const name = new URL(value).hostname.replace(/^www\./, ""); return prefix ? "www." + name : name; }
  catch { return "Website"; }
}
function setText(selector, value) { document.querySelectorAll(selector).forEach((element) => { element.textContent = value; }); }
function setLink(element, href) {
  element.classList.toggle("is-unavailable", !href);
  if (href) { element.href = href; element.removeAttribute("aria-disabled"); }
  else { element.removeAttribute("href"); element.setAttribute("aria-disabled", "true"); }
}
let toastTimer;
function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 3800);
}

function renderProfile() {
  const portrait = imageUrl(profile.portrait) || baseProfile.portrait;
  const logo = imageUrl(profile.logo) || baseProfile.logo;
  document.querySelectorAll("[data-portrait]").forEach((image) => { image.src = portrait; if (image.alt) image.alt = profile.name || "Profile photo"; });
  document.querySelectorAll("[data-company-logo]").forEach((image) => { image.src = logo; if (image.alt) image.alt = profile.company || "Company"; });
  const initials = String(profile.name || "Your profile").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((word) => Array.from(word)[0]).join("").toUpperCase();
  document.querySelectorAll("[data-initials]").forEach((element) => {
    element.replaceChildren(document.createTextNode(initials));
    const dot = document.createElement("span"); dot.className = "status-dot"; element.append(dot);
  });
  setText("[data-name]", profile.name || "Your name");
  setText("[data-title]", profile.title || "");
  setText("[data-tagline]", profile.tagline || "Let's stay connected.");
  setText("[data-about]", profile.about || "A little about me, coming soon.");
  setText("[data-company-name]", profile.company || "My company");
  setText("[data-company-tagline]", profile.companyTagline || "Smart cards. Meaningful connections.");
  setText("[data-company-description]", profile.companyDescription || "Company information coming soon.");
  setText("[data-company-eyebrow]", (profile.company || "TAPX").toUpperCase() + " / COMPANY");
  $("company-link").hidden = !profile.showCompany || !profile.company.trim();
  document.querySelectorAll('[data-contact="phone"]').forEach((element) => setLink(element, digits(profile.phone) ? `tel:${phoneValue(profile.phone)}` : ""));
  document.querySelectorAll('[data-contact="email"]').forEach((element) => setLink(element, profile.email ? `mailto:${profile.email}` : ""));
  document.querySelectorAll('[data-contact="whatsapp"]').forEach((element) => setLink(element, whatsappUrl(profile.whatsapp || profile.phone)));
  const website = webUrl(profile.website);
  document.querySelectorAll('[data-contact="website"]').forEach((element) => setLink(element, website));
  setText("[data-website-label]", domain(website));
  const companyWebsite = webUrl(profile.companyWebsite) || webUrl(baseProfile.companyWebsite);
  document.querySelectorAll("[data-company-website]").forEach((element) => setLink(element, companyWebsite));
  setText("[data-company-domain]", domain(companyWebsite, true));
  renderSocials();
  renderGallery();
  document.title = `${profile.name || "My profile"} | Personal Digital Profile`;
  scheduleSwipeMode();
}
function renderSocials() {
  $("social-links").replaceChildren();
  for (const [name, label] of Object.entries(socialNames)) {
    const href = webUrl(profile.socials[name]);
    const element = document.createElement(href ? "a" : "button");
    element.className = `social-button social-${name}`;
    if (href) { element.href = href; element.target = "_blank"; element.rel = "noopener noreferrer"; }
    else {
      element.type = "button";
      element.classList.add("is-unavailable");
      element.setAttribute("aria-disabled", "true");
      element.title = `${label} link hasn't been added yet`;
      element.onclick = () => toast(`${label} link hasn't been added yet.`);
    }
    const symbol = document.createElement("span"); symbol.dataset.icon = name; symbol.innerHTML = icon(name);
    const text = document.createElement("span"); text.textContent = label;
    element.append(symbol, text);
    $("social-links").append(element);
  }
}
function renderGallery() {
  $("gallery-list").replaceChildren();
  $("company-previews").replaceChildren();
  const gallery = profile.gallery.filter((item) => imageUrl(item.src));
  gallery.forEach((item, index) => {
    const figure = document.createElement("figure"); figure.className = "gallery-card";
    const image = new Image(); image.src = imageUrl(item.src); image.alt = item.alt || item.title || "Company photo"; image.loading = "lazy";
    const caption = document.createElement("figcaption"); caption.textContent = item.title || "Company photo";
    figure.append(image, caption); $("gallery-list").append(figure);
    if (index < 2) {
      const preview = document.createElement("a"); preview.href = "#gallery"; preview.setAttribute("aria-label", `View ${item.title || "company photo"}`);
      const thumbnail = image.cloneNode(); preview.append(thumbnail); $("company-previews").append(preview);
    }
  });
  if (!gallery.length) { const message = document.createElement("p"); message.className = "detail-intro"; message.textContent = "Company photos haven't been added yet."; $("gallery-list").append(message); }
  $("business-card-image").src = imageUrl(baseProfile.gallery[0].src);
}

function usePointerInput() { document.documentElement.dataset.inputMode = "pointer"; }
document.addEventListener("pointerdown", usePointerInput, { capture: true, passive: true });
document.addEventListener("touchstart", usePointerInput, { capture: true, passive: true });
document.addEventListener("keydown", (event) => { if (!["Shift", "Control", "Alt", "Meta"].includes(event.key)) document.documentElement.dataset.inputMode = "keyboard"; }, true);
document.addEventListener("click", (event) => {
  const unavailable = event.target.closest("a.is-unavailable");
  if (unavailable) { event.preventDefault(); toast("This contact detail hasn't been added yet."); }
});

function currentRoute() {
  const value = location.hash.slice(1);
  return routes.has(value) ? value : "profile";
}
function navigate(route) {
  if (!routes.has(route)) return;
  if (currentRoute() === route) { renderRoute(); return; }
  location.hash = route;
}
function renderRoute() {
  const route = currentRoute();
  for (const screen of document.querySelectorAll(".screen")) {
    const active = screen.id === `screen-${route}`;
    screen.hidden = !active;
    screen.classList.toggle("route-enter", active);
  }
  const active = $(`screen-${route}`);
  active.tabIndex = -1;
  active.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  scheduleSwipeMode();
}
window.addEventListener("hashchange", renderRoute);
try { history.scrollRestoration = "manual"; } catch {}
let swipeFrame = 0;
function scheduleSwipeMode() {
  if (swipeFrame) return;
  swipeFrame = requestAnimationFrame(() => {
    swipeFrame = 0;
    const style = getComputedStyle(document.body);
    const outerPadding = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
    const viewportHeight = Math.min(innerHeight, window.visualViewport?.height || innerHeight) - outerPadding;
    for (const id of ["profile", "socials"]) {
      const screen = $(`screen-${id}`);
      screen.classList.toggle("can-swipe", !screen.hidden && screen.getBoundingClientRect().height <= viewportHeight + 1);
    }
  });
}
window.addEventListener("resize", scheduleSwipeMode);
window.visualViewport?.addEventListener("resize", scheduleSwipeMode);
if ("ResizeObserver" in window) new ResizeObserver(scheduleSwipeMode).observe($("app"));

function bindSwipe(surface, direction, destination, cueId) {
  let gesture = null;
  let suppressClickUntil = 0;
  function reset() {
    const id = gesture?.id;
    gesture = null;
    surface.classList.remove("is-swiping");
    if (id !== undefined && surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
  }
  surface.addEventListener("pointerdown", (event) => {
    reset();
    suppressClickUntil = 0;
    if (event.isPrimary === false || (event.pointerType === "mouse" && event.button !== 0)) return;
    const onCue = $(cueId).contains(event.target);
    if (!surface.classList.contains("can-swipe") && !onCue) return;
    if (!onCue && event.target.closest("a, button, input, textarea, select, label")) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, active: false };
  });
  surface.addEventListener("pointermove", (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dy = direction * (event.clientY - gesture.y);
    const dx = Math.abs(event.clientX - gesture.x);
    if (dy < -12 || (dx > 16 && dx > Math.abs(dy) * 1.1)) { reset(); return; }
    if (dy < 8 || dy < dx * 1.2) return;
    if (!gesture.active) { gesture.active = true; surface.setPointerCapture(event.pointerId); }
    surface.classList.add("is-swiping");
    if (event.cancelable) event.preventDefault();
  }, { passive: false });
  surface.addEventListener("pointerup", (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dy = direction * (event.clientY - gesture.y);
    const dx = Math.abs(event.clientX - gesture.x);
    const complete = gesture.active && dy >= 60 && dy > dx * 1.25;
    const moved = Math.max(Math.abs(dy), dx) > 10;
    reset();
    if (moved) suppressClickUntil = performance.now() + 500;
    if (complete) navigate(destination);
  });
  surface.addEventListener("pointercancel", reset);
  surface.addEventListener("lostpointercapture", (event) => { if (event.target === surface && gesture?.id === event.pointerId) reset(); });
  surface.addEventListener("click", (event) => {
    if (event.detail > 0 && performance.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); suppressClickUntil = 0; }
  }, true);
  $(cueId).addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === (direction === -1 ? "ArrowUp" : "ArrowDown")) { event.preventDefault(); navigate(destination); }
  });
}
bindSwipe($("screen-profile"), -1, "socials", "swipe-up");
bindSwipe($("screen-socials"), 1, "profile", "swipe-down");

function escapeVcard(value) { return String(value || "").replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;"); }
function downloadContact() {
  const words = profile.name.trim().split(/\s+/);
  const family = words.length > 1 ? words.pop() : "";
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${escapeVcard(profile.name)}`, `N:${escapeVcard(family)};${escapeVcard(words.join(" "))};;;`];
  for (const [key, value] of [["TITLE", profile.title], ["ORG", profile.company], ["TEL;TYPE=CELL", profile.phone], ["EMAIL", profile.email], ["URL", webUrl(profile.website)], ["NOTE", profile.about]]) if (value) lines.push(`${key}:${escapeVcard(value)}`);
  lines.push("END:VCARD");
  const url = URL.createObjectURL(new Blob([lines.join("\r\n") + "\r\n"], { type: "text/vcard;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = (profile.name.replace(/[^a-z0-9]+/gi, "-") || "My-contact") + ".vcf"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  toast("Contact downloaded. Open it to add it to your contacts.");
}
document.querySelectorAll('[data-action="save-contact"]').forEach((button) => { button.onclick = downloadContact; });

renderProfile();
renderRoute();
