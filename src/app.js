/* ══════════════════════════════════════
       GIFT BOX
    ══════════════════════════════════════ */
const overlay = document.getElementById("gift-overlay");
const wrapper = document.getElementById("giftBoxWrapper");
const burst = document.getElementById("confettiBurst");
const sparkle = document.getElementById("sparkle");

const EMOJIS = ["🎉", "🌟", "💛", "🎊", "✨", "🌸", "🎈", "💖", "⭐", "🥳"];
const ANGLES = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

function fireBurst() {
    burst.innerHTML = "";
    ANGLES.forEach((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const dist = 95 + Math.random() * 65;
        const tx = `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px) rotate(${Math.random() * 360}deg)`;
        const el = document.createElement("span");
        el.className = "burst-piece";
        el.textContent = EMOJIS[i % EMOJIS.length];
        el.style.setProperty("--tx", tx);
        burst.appendChild(el);
        requestAnimationFrame(() =>
            requestAnimationFrame(() => el.classList.add("pop")),
        );
    });
}

function openGift() {
    wrapper.removeEventListener("click", openGift);
    wrapper.removeEventListener("touchend", openGift);
    fireBurst();
    wrapper.classList.add("opening");
    setTimeout(() => {
        overlay.classList.add("hidden");
        resetTimer();
        // Staggered top-to-bottom reveal after overlay fades
        const items = [
            { el: document.querySelector(".subtitle"), delay: "0.1s" },
            { el: document.querySelector(".main-title"), delay: "0.3s" },
            { el: document.querySelector(".hero-name"), delay: "0.55s" },
            { el: document.querySelector(".ribbon"), delay: "0.75s" },
            { el: document.querySelector(".slider-section"), delay: "1s" },
            { el: document.querySelector(".wish-section"), delay: "1.3s" },
        ];
        items.forEach(({ el, delay }) => {
            if (!el) return;
            el.style.animationDelay = delay;
            el.classList.add("animate-in");
        });
    }, 950);
}

wrapper.addEventListener("click", openGift);
wrapper.addEventListener("touchend", openGift, { passive: true });

/* ══════════════════════════════════════
       PARTICLES
    ══════════════════════════════════════ */
const COLORS = ["#f5c842", "#e8587a", "#8b5cf6", "#ffd6e0", "#fff"];
const pc = document.getElementById("particles");
const cnt = window.innerWidth < 500 ? 22 : 50;

for (let i = 0; i < cnt; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    const s = 3 + Math.random() * 7;
    el.style.cssText = `
        left:${Math.random() * 100}%;
        width:${s}px; height:${s}px;
        background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
        animation-duration:${6 + Math.random() * 10}s;
        animation-delay:${Math.random() * 8}s`;
    pc.appendChild(el);
}

/* ══════════════════════════════════════
       PHOTO SLIDER
    ══════════════════════════════════════ */
const images = [
    { src: "src/image/img2.webp", caption: "A beautiful memory 💛" },
    { src: "src/image/img3.webp", caption: "Full of joy & love 🌸" },
    {
        src: "src/image/img4.webp",
        caption: "Every moment with you is magic ✨",
    },
    { src: "src/image/img5.webp", caption: "Another perfect moment 🎉" },
    { src: "src/image/img1.webp", caption: "You shine so bright 🌟" },
    {
        src: "src/image/img7.webp",
        caption: "Growing up with you was a blessing 🌺",
    },
];

const track = document.getElementById("track");
const dotsEl = document.getElementById("dots");
let total = 0,
    current = 0,
    isTransitioning = false,
    timer;

function makeSlide(item, idx, isClone = false) {
    const slide = document.createElement("div");
    slide.className = "slide";
    if (!isClone) slide.dataset.index = idx;
    slide.innerHTML = `
        <img src="${item.src}" alt="Birthday photo ${idx + 1}"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
        <div class="slide-placeholder" style="display:none;">🎂</div>
        <div class="slide-caption">${item.caption}</div>`;
    return slide;
}

function buildSlides(list) {
    track.innerHTML = "";
    total = list.length;

    // Clone last slide → prepend
    track.appendChild(makeSlide(list[total - 1], total - 1, true));

    // Real slides
    list.forEach((item, idx) => track.appendChild(makeSlide(item, idx)));

    // Clone first slide → append
    track.appendChild(makeSlide(list[0], 0, true));

    // Start at position 1 (first real slide) instantly, no transition
    current = 1;
    track.style.transition = "none";
    track.style.transform = `translateX(-${current * 100}%)`;
    updateActiveSlide();
}

function buildDots() {
    dotsEl.innerHTML = "";
    for (let i = 0; i < total; i++) {
        const d = document.createElement("button");
        d.className = "dot" + (i === 0 ? " active" : "");
        d.setAttribute("aria-label", `Slide ${i + 1}`);
        d.addEventListener("click", () => goToReal(i));
        dotsEl.appendChild(d);
    }
}

// realIndex = 0-based index into original images array
function goToReal(realIndex) {
    goTo(realIndex + 1); // +1 because position 0 is the cloned last
}

function goTo(pos) {
    if (isTransitioning) return;
    isTransitioning = true;

    current = pos;
    track.style.transition = "transform 0.7s cubic-bezier(0.77, 0, 0.18, 1)";
    track.style.transform = `translateX(-${current * 100}%)`;
    updateActiveSlide();
    resetTimer();
}

function updateActiveSlide() {
    // real index (clamp to 0..total-1)
    const realIdx =
        current <= 0 ? total - 1 : current >= total + 1 ? 0 : current - 1;
    // update dots
    document
        .querySelectorAll(".dot")
        .forEach((d, i) => d.classList.toggle("active", i === realIdx));
    // active class for zoom effect on real slides
    Array.from(track.children).forEach((s, i) => {
        s.classList.toggle("active", i === current);
    });
}

// After CSS transition ends, silently jump if we're on a clone
track.addEventListener("transitionend", () => {
    isTransitioning = false;

    if (current === 0) {
        // Was showing clone of last → jump to real last (no animation)
        track.style.transition = "none";
        current = total;
        track.style.transform = `translateX(-${current * 100}%)`;
        updateActiveSlide();
    } else if (current === total + 1) {
        // Was showing clone of first → jump to real first (no animation)
        track.style.transition = "none";
        current = 1;
        track.style.transform = `translateX(-${current * 100}%)`;
        updateActiveSlide();
    }
});

function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4200);
}

buildSlides(images);
buildDots();

document
    .getElementById("prev")
    .addEventListener("click", () => goTo(current - 1));
document
    .getElementById("next")
    .addEventListener("click", () => goTo(current + 1));

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
});

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

document.addEventListener("visibilitychange", () =>
    document.hidden ? clearInterval(timer) : resetTimer(),
);
