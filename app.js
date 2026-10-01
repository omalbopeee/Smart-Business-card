const p = window.PROFILE;
const $ = (id) => document.getElementById(id);
const paths = {
  share: '<path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  chat: '<path d="M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.4-4.7A9 9 0 1 1 21 11.5Z"/><path d="M8 11h8m-8 4h5"/>',
  phone: '<path d="m7 3 3 5-3 2a14 14 0 0 0 7 7l2-3 5 3-1 4C11 23 1 13 3 4Z"/>',
  email:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  pin: '<path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  company:
    '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2m2 0h2M9 11h2m2 0h2m-5 10v-5h4v5"/>',
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 6h.01"/>',
  facebook:
    '<path d="M14 21v-9h3l.5-4H14V6c0-1 .5-2 2-2h2V1h-3c-4 0-5 2-5 5v2H7v4h3v9"/>',
  tiktok: '<path d="M14 3v12a4 4 0 1 1-4-4M14 3c1 4 3 5 6 5"/>',
};
function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.globe}</svg>`;
}
function safeUrl(value) {
  try {
    const u = new URL(value);
    return ["https:", "http:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
}
let toastTimer;
function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 4000);
}
document.documentElement.style.setProperty("--accent", p.accent);
$("name").textContent = p.name || "Your name";
$("role").textContent =
  [p.title, p.company].filter(Boolean).join(" - ") ||
  "Your title - Your company";
$("bio").textContent =
  p.bio || "A little about you and the connections you'd love to make.";
$("brand").textContent = p.company ? "tapx" : "YOUR BRAND";
document.title = `${p.name || "Your profile"} | Digital business card`;
if (p.portrait) {
  $("portrait").style.backgroundImage = `url(${JSON.stringify(p.portrait)})`;
}
if (p.logo) {
  const logo = new Image();
  logo.src = p.logo;
  logo.alt = p.company;
  $("brand").replaceChildren(logo);
}
$("share-top").innerHTML = icon("share");
document
  .querySelectorAll("[data-icon]")
  .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
for (const [name, url] of Object.entries(p.socials)) {
  const href = safeUrl(url);
  if (!href) continue;
  const link = document.createElement("a");
  link.innerHTML = icon(name);
  link.setAttribute("aria-label", name);
  link.title = name;
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  $("socials").append(link);
}
const digits = (value) => value.replace(/[^\d]/g, "");
function row(label, value, type, href) {
  const el = document.createElement(href ? "a" : "div");
  el.className = "contact-row";
  if (href) {
    el.href = href;
    if (href.startsWith("http")) {
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  }
  const symbol = document.createElement("span");
  symbol.innerHTML = icon(type);
  const body = document.createElement("span");
  const small = document.createElement("small");
  small.textContent = label;
  const text = document.createElement("strong");
  text.textContent = value;
  body.append(small, text);
  const arrow = document.createElement("span");
  arrow.className = "external";
  arrow.textContent = href ? "\u2197" : "";
  el.append(symbol, body, arrow);
  $("contact-list").append(el);
}
if (p.phone)
  row("Mobile number", p.phoneDisplay || p.phone, "phone", `tel:${p.phone}`);
if (p.email) row("Email", p.email, "email", `mailto:${p.email}`);
if (p.website) row("Website", p.website, "globe", safeUrl(p.website));
if (p.address)
  row(
    "Address",
    p.address,
    "pin",
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`,
  );
if (p.company) row("Company", p.company, "company");
$("about").textContent = p.about || p.bio || "About information coming soon.";
$("company").textContent =
  p.companyDescription || "Company details coming soon.";
if (p.gallery.length) {
  for (const item of p.gallery) {
    const img = new Image();
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    $("gallery").append(img);
  }
} else {
  $("gallery").textContent = "A closer look at my work - photos coming soon.";
}
const dialog = $("contact-dialog");
$("open-contact").onclick = () => dialog.showModal();
$("close-contact").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
let startY = 0;
$("open-contact").addEventListener(
  "touchstart",
  (e) => (startY = e.changedTouches[0].clientY),
  { passive: true },
);
$("open-contact").addEventListener(
  "touchend",
  (e) => {
    if (startY - e.changedTouches[0].clientY > 25) dialog.showModal();
  },
  { passive: true },
);
const tabs = [...document.querySelectorAll("[role=tab]")];
function selectTab(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.setAttribute("aria-selected", active);
    t.tabIndex = active ? 0 : -1;
    $(t.getAttribute("aria-controls")).hidden = !active;
  });
}
tabs.forEach((tab, i) => {
  tab.onclick = () => selectTab(tab);
  tab.onkeydown = (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const next =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? tabs.length - 1
            : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) %
              tabs.length;
      selectTab(tabs[next]);
      tabs[next].focus();
    }
  };
});
$("connect").onclick = () => {
  if (p.whatsapp) {
    window.open(
      `https://wa.me/${digits(p.whatsapp)}`,
      "_blank",
      "noopener,noreferrer",
    );
  } else if (p.email) {
    location.href = `mailto:${p.email}`;
  } else toast("Contact details coming soon.");
};
function escapeVcard(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
function vcard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVcard(p.name)}`,
    `N:;${escapeVcard(p.name)};;;`,
  ];
  for (const [key, value] of [
    ["ORG", p.company],
    ["TITLE", p.title],
    ["TEL;TYPE=CELL", p.phone],
    ["EMAIL", p.email],
    ["URL", p.website],
    ["NOTE", p.bio],
  ])
    if (value) lines.push(`${key}:${escapeVcard(value)}`);
  if (p.address) lines.push(`ADR;TYPE=WORK:;;${escapeVcard(p.address)};;;;`);
  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}
$("save-contact").onclick = () => {
  if (!p.name) return toast("Profile details coming soon.");
  const url = URL.createObjectURL(
    new Blob([vcard()], { type: "text/vcard;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${p.name.replace(/[^a-z0-9]+/gi, "-")}.vcf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Contact downloaded. Open it to add to your contacts.");
};
async function share() {
  if (!/^https?:$/.test(location.protocol))
    return toast("Share will be available when this card is hosted online.");
  try {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        text: `Connect with ${p.name}`,
        url: location.href,
      });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(location.href);
      toast("Profile link copied.");
    } else {
      toast("Copy this page's address to share your card.");
    }
  } catch (error) {
    if (error.name !== "AbortError")
      toast("Copy this page's address to share your card.");
  }
}
$("share").onclick = share;
$("share-top").onclick = share;

