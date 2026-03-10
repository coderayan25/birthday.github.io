/* ── Particles – fewer on mobile for performance ── */
const COLORS = ["#f5c842", "#e8587a", "#8b5cf6", "#ffd6e0", "#fff"];
const pc = document.getElementById("particles");
const cnt = window.innerWidth < 500 ? 22 : 50;

for (let i = 0; i < cnt; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    const s = 3 + Math.random() * 7;
    el.style.cssText = `
    left:${Math.random() * 100}%;
    width:${s}px;
    height:${s}px;
    background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
    animation-duration:${6 + Math.random() * 10}s;
    animation-delay:${Math.random() * 8}s`;
    pc.appendChild(el);
}
const images = [
    {
        src: "src/image/img2.webp",
        caption: "A beautiful memory 💛",
    },
    {
        src: "src/image/img6.webp",
        caption: "Forever treasured ✨",
    },
    {
        src: "src/image/img3.webp",
        caption: "Full of joy & love 🌸",
    },
    {
        src: "src/image/img4.webp",
        caption: "Every moment with you is magic ✨",
    },
    {
        src: "src/image/img5.webp",
        caption: "Another perfect moment 🎉",
    },
    {
        src: "src/image/img1.webp",
        caption: "You shine so bright 🌟",
    },
    {
        src: "src/image/img7.webp",
        caption: "Growing up with you was a blessing 🌺",
    },
];

const track = document.getElementById("track");
const dotsEl = document.getElementById("dots");
let slides = [],
    current = 0,
    timer;

// Build slides from the images array
function buildSlides(imageList) {
    track.innerHTML = "";
    imageList.forEach((item, idx) => {
        const slide = document.createElement("div");
        slide.className = "slide" + (idx === 0 ? " active" : "");

        // Use <img> for real photos, placeholder emoji if src is missing
        slide.innerHTML = `
      <img
        src="${item.src}"
        alt="Birthday photo ${idx + 1}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; loading=false;"
      />
      <div class="slide-placeholder" style="display:none;">🎂</div>
      <div class="slide-caption">${item.caption}</div>
    `;
        track.appendChild(slide);
    });
    current = 0;
    track.style.transform = "translateX(0)";
}

function buildDots() {
    dotsEl.innerHTML = "";
    slides = Array.from(track.querySelectorAll(".slide"));
    slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.className = "dot" + (i === current ? " active" : "");
        d.setAttribute("aria-label", `Slide ${i + 1}`);
        d.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(d);
    });
}

function goTo(n) {
    slides[current].classList.remove("active");
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides[current].classList.add("active");
    document
        .querySelectorAll(".dot")
        .forEach((d, i) => d.classList.toggle("active", i === current));
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4200);
}

// Initialise
buildSlides(images);
buildDots();
resetTimer();

document
    .getElementById("prev")
    .addEventListener("click", () => goTo(current - 1));
document
    .getElementById("next")
    .addEventListener("click", () => goTo(current + 1));

/* ── Keyboard navigation ── */
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
});

/* ── Touch & pointer swipe ── */
let sx = 0,
    dragging = false;
const sw = document.getElementById("sliderWrapper");

sw.addEventListener(
    "touchstart",
    (e) => {
        sx = e.touches[0].clientX;
        dragging = true;
    },
    { passive: true },
);

sw.addEventListener(
    "touchend",
    (e) => {
        if (!dragging) return;
        dragging = false;
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 35) goTo(dx < 0 ? current + 1 : current - 1);
    },
    { passive: true },
);

sw.addEventListener("pointerdown", (e) => {
    sw.setPointerCapture(e.pointerId);
    sx = e.clientX;
    dragging = true;
});

sw.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 35) goTo(dx < 0 ? current + 1 : current - 1);
});

/* ── Pause auto-play when tab is hidden (battery saving) ── */
document.addEventListener("visibilitychange", () =>
    document.hidden ? clearInterval(timer) : resetTimer(),
);
