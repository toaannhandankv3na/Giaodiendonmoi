/* ===== Dữ liệu ===== */
const L = {
  hs: "https://drive.google.com/drive/folders/1ifkMb_gB2QrRU71NDGwy7Ra3rtsOktMa?usp=drive_link",
  hc: "https://drive.google.com/drive/folders/1ZkgSfR0yjmug0hGpDU95JBLky71y3Jzc?usp=drive_link",
  vds: "https://drive.google.com/drive/folders/1FoGvNZJY9SD-SYAHABJXaHRrdCgr7fD3?usp=drive_link",
  vads: "https://drive.google.com/drive/folders/1AmKIP80XgfBWVPRl2YL5pX12LxHXvI9M?usp=drive_link",
  hn: "https://drive.google.com/drive/folders/1934MlzOeBkORECw0W50dBmbPuWlyU6Hl?usp=drive_link",
  ld: "https://drive.google.com/drive/folders/1GUpNNeBeZh_UYyv8Lwol1GqOidkvyrNT?usp=drive_link",
  ap: "https://drive.google.com/drive/folders/1MvQSaTH51iEYWmAn1AffLUzp_f5kIWyv?usp=drive_link",
  kh: "https://drive.google.com/drive/folders/11ll2Bssc6P7MJYn-bPW0mw8oY4qMQdLP?usp=drive_link"
};
const categories = [
  { name: "Hình sự", desc: "Biểu mẫu tố tụng hình sự", icon: "⚖", url: L.hs },
  { name: "Hành chính", desc: "Biểu mẫu tố tụng hành chính", icon: "▤", url: L.hc },
  { name: "Dân sự", desc: "Việc dân sự, vụ án dân sự, hôn nhân, lao động và án phí", icon: "§", children: [
    { name: "Việc Dân sự", desc: "Biểu mẫu giải quyết việc dân sự", url: L.vds },
    { name: "Vụ án Dân sự", desc: "Biểu mẫu giải quyết vụ án dân sự", url: L.vads },
    { name: "Vụ việc Hôn nhân và gia đình", desc: "Biểu mẫu hôn nhân và gia đình", url: L.hn },
    { name: "Vụ án Lao động", desc: "Biểu mẫu vụ án lao động", url: L.ld },
    { name: "Đơn xin miễn tạm ứng án phí, án phí", desc: "Đơn đề nghị miễn tạm ứng án phí, án phí", url: L.ap }
  ]},
  { name: "Các biểu mẫu khác", desc: "Các biểu mẫu và loại đơn khác", icon: "▧", url: L.kh }
];

/* ===== Tiện ích ===== */
const $ = (s, r = document) => r.querySelector(s);
const grid = $("#categoryGrid"), search = $("#searchInput");
const norm = s => s.toLocaleLowerCase("vi");
const hit = (q, ...t) => !q || norm(t.join(" ")).includes(q);
const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ARROW = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg>';
const CHEV = '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';

/* ===== Hiển thị danh mục ===== */
function card(c, i, q) {
  const head = `<span class="ico" aria-hidden="true">${c.icon}</span>`;
  if (!c.children) return `<a class="card glass" style="--i:${i}" href="${c.url}" target="_blank" rel="noopener noreferrer">
    <span class="card-main">${head}<span class="copy"><b>${esc(c.name)}</b><small>${esc(c.desc)}</small><em>Mở thư mục Drive</em></span><span class="go">${ARROW}</span></span></a>`;
  const open = !!q;
  return `<article class="card glass${open ? " open" : ""}" style="--i:${i}">
    <button class="card-main" type="button" aria-expanded="${open}" aria-controls="sub-${i}">${head}<span class="copy"><b>${esc(c.name)}</b><small>${esc(c.desc)}</small><em>Nhấn để chọn lĩnh vực</em></span><span class="go">${CHEV}</span></button>
    <div class="sub" id="sub-${i}"><div>${c.children.map(k => `<a href="${k.url}" target="_blank" rel="noopener noreferrer"><span><b>${esc(k.name)}</b><small>${esc(k.desc)}</small></span>${ARROW}</a>`).join("")}</div></div></article>`;
}

function render(query = "") {
  const q = norm(query.trim());
  const html = categories.map((c, i) => {
    if (!c.children) return hit(q, c.name, c.desc) ? card(c, i, q) : "";
    const kids = c.children.filter(k => hit(q, k.name, k.desc));
    const self = hit(q, c.name, c.desc);
    return self || kids.length ? card({ ...c, children: self ? c.children : kids }, i, q) : "";
  }).join("");
  grid.innerHTML = html || '<p class="empty">Không tìm thấy lĩnh vực phù hợp. Vui lòng thử từ khóa khác.</p>';
}

/* Một listener duy nhất cho toàn bộ lưới */
grid.addEventListener("click", e => {
  const btn = e.target.closest("button.card-main");
  if (!btn) return;
  const card = btn.closest(".card"), open = card.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});

let timer;
search.addEventListener("input", e => { clearTimeout(timer); timer = setTimeout(() => render(e.target.value), 120); });
document.addEventListener("keydown", e => {
  if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); search.focus(); }
  if (e.key === "Escape" && document.activeElement === search) { search.value = ""; render(); search.blur(); }
});

/* ===== Ánh sáng kính theo con trỏ ===== */
document.addEventListener("pointermove", e => {
  const el = e.target.closest?.(".glass");
  if (!el || e.pointerType === "touch") return;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", e.clientX - r.left + "px");
  el.style.setProperty("--my", e.clientY - r.top + "px");
}, { passive: true });

/* ===== Hiệu ứng cuộn: xuất hiện + menu đang chọn ===== */
document.documentElement.classList.add("js");
const reveal = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
}), { threshold: .12, rootMargin: "0px 0px -40px" });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + "ms"; reveal.observe(el); });

const links = [...document.querySelectorAll(".nav a")];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
["home", "forms", "guide", "contact"].forEach(id => spy.observe(document.getElementById(id)));

render();
