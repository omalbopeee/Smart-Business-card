const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "tapx.personal-profile.v1";
const OWNER_KEY = "tapx.demo-owner.v1";
const baseProfile = JSON.parse(JSON.stringify(window.PROFILE));
const copy = (value) => JSON.parse(JSON.stringify(value));
const routes = new Set(["profile", "socials", "company", "gallery", "products", "signin", "editor"]);
const socialNames = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn", tiktok: "TikTok" };
let profile = loadProfile();
let editorDraft = null;
let imageJobs = 0;
let ownerSession = false;
try { ownerSession = sessionStorage.getItem(OWNER_KEY) === "1"; } catch {}

const paths = {
  edit: '<path d="m15 4 5 5M4 16l-1 5 5-1L21 7a2 2 0 0 0-5-5Z"/><path d="m13 6 5 5"/>',
  save: '<circle cx="9" cy="6" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M19 8v10m-3-3 3 3 3-3"/>',
  phone: '<path d="m7 3 3 5-3 2a14 14 0 0 0 7 7l2-3 5 3-1 4C11 23 1 13 3 4Z"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  whatsapp: '<path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8a8.5 8.5 0 1 1 16.2-4Z"/><path d="m8.2 7.2 1.4 2.7-1.2 1.1a8.5 8.5 0 0 0 4.6 4.6l1.1-1.2 2.7 1.4c-.2 1.1-1 1.7-2.1 1.7-4.2-.3-8.3-4.4-8.6-8.6 0-1.1.6-1.9 1.7-2.1Z"/>',
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

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return copy(baseProfile);
    const result = copy(baseProfile);
    for (const key of Object.keys(baseProfile)) {
      if (typeof baseProfile[key] === "string" && typeof saved[key] === "string") result[key] = saved[key];
      if (typeof baseProfile[key] === "boolean" && typeof saved[key] === "boolean") result[key] = saved[key];
    }
    if (saved.socials && typeof saved.socials === "object") {
      for (const name of Object.keys(result.socials)) if (typeof saved.socials[name] === "string") result.socials[name] = saved.socials[name];
    }
    if (Array.isArray(saved.gallery)) result.gallery = saved.gallery.filter((item) => item && typeof item.src === "string").slice(0, 8).map((item) => ({ src: item.src, title: String(item.title || "Company photo"), alt: String(item.alt || item.title || "Company photo") }));
    return result;
  } catch { return copy(baseProfile); }
}
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
  let route = currentRoute();
  if (route === "editor" && !ownerSession) {
    route = "signin";
    history.replaceState(null, "", "#signin");
  }
  for (const screen of document.querySelectorAll(".screen")) {
    const active = screen.id === `screen-${route}`;
    screen.hidden = !active;
    screen.classList.toggle("route-enter", active);
  }
  if (route === "editor") fillEditor();
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

$("owner-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("owner-email").value.trim().toLowerCase();
  if (profile.email && email !== profile.email.trim().toLowerCase()) {
    $("owner-error").textContent = "Use the email address on this profile to open the demo editor.";
    return;
  }
  $("owner-error").textContent = "";
  ownerSession = true;
  try { sessionStorage.setItem(OWNER_KEY, "1"); } catch {}
  navigate("editor");
});
function fillEditor() {
  editorDraft = copy(profile);
  const values = {
    "edit-name": profile.name, "edit-title": profile.title, "edit-about": profile.about,
    "edit-phone": profile.phone, "edit-email": profile.email, "edit-whatsapp": profile.whatsapp,
    "edit-facebook": profile.socials.facebook, "edit-instagram": profile.socials.instagram,
    "edit-linkedin": profile.socials.linkedin, "edit-tiktok": profile.socials.tiktok,
    "edit-website": profile.website, "edit-company": profile.company,
    "edit-company-website": profile.companyWebsite, "edit-company-description": profile.companyDescription,
  };
  for (const [id, value] of Object.entries(values)) $(id).value = value || "";
  $("edit-show-company").checked = profile.showCompany;
  $("editor-photo").src = imageUrl(profile.portrait) || baseProfile.portrait;
  $("photo-input").value = ""; $("gallery-input").value = "";
  $("editor-error").textContent = "";
  $("manage-fields").hidden = true;
  $("toggle-manage").setAttribute("aria-expanded", "false");
  renderEditorGallery();
}
$("toggle-manage").addEventListener("click", () => {
  const expanded = $("toggle-manage").getAttribute("aria-expanded") !== "true";
  $("toggle-manage").setAttribute("aria-expanded", String(expanded));
  $("manage-fields").hidden = !expanded;
  if (expanded) $("manage-fields").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
});
function renderEditorGallery() {
  $("editor-gallery").replaceChildren();
  if (!editorDraft) return;
  editorDraft.gallery.forEach((item, index) => {
    const figure = document.createElement("figure");
    const image = new Image(); image.src = imageUrl(item.src); image.alt = item.title || "Company photo";
    const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", `Remove ${item.title || "company photo"}`);
    remove.onclick = () => { editorDraft.gallery.splice(index, 1); renderEditorGallery(); };
    const caption = document.createElement("input"); caption.type = "text"; caption.value = item.title || ""; caption.placeholder = "Photo caption"; caption.setAttribute("aria-label", "Photo caption"); caption.maxLength = 100;
    caption.oninput = () => { item.title = caption.value; item.alt = caption.value || "Company photo"; };
    figure.append(image, remove, caption); $("editor-gallery").append(figure);
  });
}
function updateImageBusy() {
  document.querySelectorAll('button[form="profile-form"], .save-changes').forEach((button) => { button.disabled = imageJobs > 0; });
}
async function readImage(file, size) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Please choose an image smaller than 10 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error("This image could not be opened. Please try a JPG, PNG, or WebP image.")); image.src = url; });
    const scale = Math.min(1, size / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d"); context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", .88);
  } finally { URL.revokeObjectURL(url); }
}
$("photo-input").addEventListener("change", async () => {
  const file = $("photo-input").files[0];
  if (!file || !editorDraft) return;
  const draft = editorDraft; imageJobs++; updateImageBusy();
  try { const data = await readImage(file, 1024); if (editorDraft === draft) { draft.portrait = data; $("editor-photo").src = data; } }
  catch (error) { $("editor-error").textContent = error.message; }
  finally { imageJobs--; updateImageBusy(); }
});
$("gallery-input").addEventListener("change", async () => {
  if (!editorDraft) return;
  const room = Math.max(0, 8 - editorDraft.gallery.length);
  const files = [...$("gallery-input").files].slice(0, room);
  if (!files.length) { toast("You can add up to 8 company photos."); return; }
  const draft = editorDraft; imageJobs++; updateImageBusy();
  try {
    const images = await Promise.all(files.map(async (file) => ({ src: await readImage(file, 1000), title: file.name.replace(/\.[^.]+$/, ""), alt: file.name.replace(/\.[^.]+$/, "") })));
    if (editorDraft === draft) { draft.gallery.push(...images); renderEditorGallery(); }
  } catch (error) { $("editor-error").textContent = error.message; }
  finally { imageJobs--; updateImageBusy(); }
});
$("profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!editorDraft || imageJobs) return;
  const value = (id) => $(id).value.trim();
  const next = copy(editorDraft);
  next.name = value("edit-name"); next.title = value("edit-title"); next.about = value("edit-about");
  next.phone = phoneValue(value("edit-phone")); next.phoneDisplay = value("edit-phone");
  next.email = value("edit-email"); next.whatsapp = phoneValue(value("edit-whatsapp"));
  next.website = value("edit-website"); next.company = value("edit-company");
  next.companyWebsite = value("edit-company-website"); next.companyDescription = value("edit-company-description");
  next.showCompany = $("edit-show-company").checked;
  for (const name of Object.keys(socialNames)) next.socials[name] = value("edit-" + name);
  const invalidPhone = [next.phone, next.whatsapp].some((phone) => phone && !/^\+?\d{7,15}$/.test(phone));
  if (invalidPhone) { $("editor-error").textContent = "Enter a valid phone or WhatsApp number, including its country code."; return; }
  const invalidUrl = [next.website, next.companyWebsite, ...Object.values(next.socials)].some((url) => url && !webUrl(url));
  if (invalidUrl) { $("editor-error").textContent = "Use a full http:// or https:// address for each link."; return; }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
  catch { $("editor-error").textContent = "The browser couldn't save these changes. Try fewer or smaller photos, or enable browser storage."; return; }
  profile = next;
  renderProfile();
  navigate("profile");
  toast("Profile saved in this browser.");
});

renderProfile();
renderRoute();
