const ctaInput    = document.getElementById("cta-input");
const ctaBtn      = document.getElementById("cta-btn");
const ctaHeadline = document.getElementById("cta-headline");
const charCountEl = document.getElementById("char-count");

ctaBtn.addEventListener("click", () => {
  const newText = ctaInput.value.trim();

  if (!newText) {
    ctaInput.style.animation = "shake 0.4s ease";
    ctaInput.style.borderColor = "#c0392b";
    ctaInput.focus();
    ctaInput.addEventListener("animationend", () => {
      ctaInput.style.animation = "";
      ctaInput.style.borderColor = "";
    }, { once: true });
    return;
  }

  // Animated text swap
  ctaHeadline.style.opacity = "0";
  ctaHeadline.style.transform = "translateY(-10px)";

  setTimeout(() => {
    ctaHeadline.textContent = `"${newText}"`;
    ctaHeadline.style.opacity = "1";
    ctaHeadline.style.transform = "translateY(0)";
  }, 320);

  // Button confirmation feedback
  const btnSpan = ctaBtn.querySelector("span");
  const originalHTML = ctaBtn.innerHTML;
  ctaBtn.innerHTML = "✓ Headline Updated!";
  ctaBtn.style.background = "#2e5e46";

  setTimeout(() => {
    ctaBtn.innerHTML = originalHTML;
    ctaBtn.style.background = "";
  }, 2200);

  ctaInput.value = "";
  charCountEl.textContent = "0";
  charCountEl.style.color = "";
});

// Enter key support
ctaInput.addEventListener("keydown", e => {
  if (e.key === "Enter") ctaBtn.click();
});

// Live char counter with color warning
ctaInput.addEventListener("input", () => {
  const len = ctaInput.value.length;
  charCountEl.textContent = len;
  if (len >= 70)      charCountEl.style.color = "#c0392b";
  else if (len >= 50) charCountEl.style.color = "#e67e22";
  else                charCountEl.style.color = "";
});


// ═══════════════════════════════════════════════════
//  2. SCROLL-TRIGGERED REVEALS
// ═══════════════════════════════════════════════════
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

revealEls.forEach(el => revealObserver.observe(el));


// ═══════════════════════════════════════════════════
//  3. STICKY HEADER
// ═══════════════════════════════════════════════════
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });


// ═══════════════════════════════════════════════════
//  4. MENU TABS
// ═══════════════════════════════════════════════════
const tabBtns    = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove("active"));
    tabContents.forEach(tc => {
      tc.classList.remove("active");
      // Re-trigger reveal on newly shown cards
      tc.querySelectorAll(".reveal").forEach(el => {
        el.classList.remove("revealed");
      });
    });

    btn.classList.add("active");
    const activeContent = document.getElementById(`tab-${target}`);
    activeContent.classList.add("active");

    // Staggered reveal for newly visible cards
    const newCards = activeContent.querySelectorAll(".reveal");
    newCards.forEach((card, i) => {
      setTimeout(() => card.classList.add("revealed"), i * 100);
    });
  });
});


// ═══════════════════════════════════════════════════
//  5. GALLERY LIGHTBOX
// ═══════════════════════════════════════════════════

// Create lightbox DOM
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");

const lbImg   = document.createElement("img");
const lbClose = document.createElement("button");
lbClose.className = "lightbox-close";
lbClose.textContent = "×";
lbClose.setAttribute("aria-label", "Close lightbox");

lightbox.appendChild(lbImg);
lightbox.appendChild(lbClose);
document.body.appendChild(lightbox);

// Open lightbox on gallery item click
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    const src = item.querySelector("img").src;
    lbImg.src = src;
    lbImg.alt = item.querySelector("img").alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });
  item.style.cursor = "pointer";
});

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => { lbImg.src = ""; }, 400);
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });


// ═══════════════════════════════════════════════════
//  6. MOBILE NAVIGATION
// ═══════════════════════════════════════════════════
const hamburger = document.getElementById("hamburger");
const mainNav   = document.getElementById("mainNav");

hamburger.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  document.body.classList.toggle("nav-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    document.body.classList.remove("nav-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});


// ═══════════════════════════════════════════════════
//  7. CURSOR GLOW 
// ═══════════════════════════════════════════════════
const cursorGlow = document.getElementById("cursorGlow");

if (window.matchMedia("(pointer: fine)").matches) {
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top  = `${glowY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
} else {
  cursorGlow.style.display = "none";
}


// ═══════════════════════════════════════════════════
//  8. RESERVATION FORM HANDLER
// ═══════════════════════════════════════════════════
const reserveForm = document.getElementById("reserveForm");

if (reserveForm) {
  reserveForm.addEventListener("submit", e => {
    e.preventDefault();
    const btn = reserveForm.querySelector("button[type='submit']");
    const original = btn.textContent;

    btn.textContent = "✓ Reservation Sent!";
    btn.style.background = "#2e5e46";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = "";
      btn.disabled = false;
      reserveForm.reset();
    }, 3000);
  });
}


// ═══════════════════════════════════════════════════
//  9. PARALLAX on hero image 
// ═══════════════════════════════════════════════════
const heroImg = document.querySelector(".hero-img");

if (heroImg && window.matchMedia("(min-width: 768px)").matches) {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    heroImg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
  }, { passive: true });
}


// ═══════════════════════════════════════════════════
//  10. ACTIVE NAV LINK on scroll
// ═══════════════════════════════════════════════════
const sections   = document.querySelectorAll("section[id], footer[id]");
const navLinks   = document.querySelectorAll("nav a");

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute("href") === `#${id}` ? "var(--clr-gold)" : "";
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));


// ═══════════════════════════════════════════════════
//  11. MENU CARD tilt on mousemove
// ═══════════════════════════════════════════════════
document.querySelectorAll(".menu-card, .drink-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -6;
    card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transformOrigin = "center center";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


// ═══════════════════════════════════════════════════
//  Inject shake keyframe for input validation
// ═══════════════════════════════════════════════════
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(shakeStyle);

// ═══════════════════════════════════════════════════
//  Page-load: trigger visible elements immediately
// ═══════════════════════════════════════════════════
window.addEventListener("load", () => {
  document.querySelectorAll(".reveal").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add("revealed");
    }
  });
});
