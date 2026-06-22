const CHECKOUT_URL = "https://pay.kiwify.com.br/97mfEBa";

const hasRealCheckout =
  typeof CHECKOUT_URL === "string" &&
  CHECKOUT_URL.trim() !== "" &&
  !CHECKOUT_URL.includes("seu-link-de-checkout-aqui");

document.querySelectorAll("[data-checkout]").forEach((element) => {
  element.addEventListener("click", (event) => {
    if (!hasRealCheckout) return;
    event.preventDefault();
    window.location.href = CHECKOUT_URL;
  });
});

const motionStyles = document.createElement("style");
motionStyles.textContent = `
.hero__bg img{transform:translate3d(0,var(--hero-parallax,0),0) scale(1.03)!important;transition:transform 100ms linear}
.hero__poster-hero{transform:translate3d(-50%,var(--hero-product-parallax,0),0)!important}
.hero-divider__track{animation-duration:12s!important;animation-timing-function:linear!important;animation-iteration-count:infinite!important;backface-visibility:hidden}
.hero-divider::before,.hero-divider::after{content:"";position:absolute;inset-block:0;z-index:2;width:clamp(18px,4vw,72px);pointer-events:none}
.hero-divider::before{left:0;background:linear-gradient(90deg,#081108,transparent)}
.hero-divider::after{right:0;background:linear-gradient(-90deg,#081108,transparent)}
.scroll-reveal{opacity:0;filter:blur(6px);transform:translate3d(0,64px,0);transition:opacity 860ms cubic-bezier(.22,1,.36,1),transform 860ms cubic-bezier(.22,1,.36,1),filter 760ms ease;transition-delay:var(--reveal-delay,0ms);will-change:opacity,transform,filter}
.scroll-reveal--left{transform:translate3d(-78px,0,0)}
.scroll-reveal--right{transform:translate3d(78px,0,0)}
.scroll-reveal--scale{transform:scale(.88)}
.scroll-reveal.is-visible{opacity:1;filter:blur(0);transform:translate3d(0,0,0) scale(1);translate:var(--scroll-motion-x,0) var(--scroll-motion-y,0);transition:opacity 860ms cubic-bezier(.22,1,.36,1),transform 860ms cubic-bezier(.22,1,.36,1),filter 760ms ease,translate 120ms linear;will-change:translate}
.scroll-progress{position:fixed;inset:0 0 auto;z-index:100;width:100%;height:4px;background:linear-gradient(90deg,#5cb70c,#ffc91e);box-shadow:0 2px 12px rgba(255,201,30,.42);transform:scaleX(0);transform-origin:left center;pointer-events:none;will-change:transform}
.hero__topbar,.hero__copy,.hero__visual{animation:hero-enter 800ms cubic-bezier(.22,1,.36,1) both}.hero__copy{animation-delay:100ms}.hero__visual{animation-delay:220ms}
@keyframes hero-enter{from{opacity:0;transform:translate3d(0,24px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@media(max-width:640px){.hero__bg img{transform:translate3d(0,var(--hero-parallax,0),0) scale(1.14)!important}.hero__poster-hero{transform:translate3d(calc(-50% - 8px),calc(-50% + var(--hero-product-parallax,0)),0)!important}}
@media(prefers-reduced-motion:reduce){.hero-divider__track{animation:none!important}.scroll-reveal,.scroll-reveal--left,.scroll-reveal--right,.scroll-reveal--scale,.hero__topbar,.hero__copy,.hero__visual{opacity:1;filter:none;transform:none;translate:none;animation:none;transition:none}.scroll-progress{display:none}}
`;
document.head.appendChild(motionStyles);

const stickyCta = document.querySelector(".sticky-cta");
const hero = document.querySelector(".hero");
const purchaseToast = document.querySelector(".purchase-toast");
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
document.body.prepend(scrollProgress);

const revealElements = [];
let scrollFrame = 0;

const updateScrollEffects = () => {
  scrollFrame = 0;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;

  if (!reducedMotionPreference.matches && hero) {
    const heroProgress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
    hero.style.setProperty("--hero-parallax", `${heroProgress * 42}px`);
    hero.style.setProperty("--hero-product-parallax", `${heroProgress * -18}px`);
  }

  if (!reducedMotionPreference.matches) {
    revealElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;

      const distance = Math.max(-1, Math.min(1,
        (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      ));
      const verticalShift = distance * (index % 2 === 0 ? 16 : -16);
      const horizontalShift = distance * (index % 3 === 0 ? 5 : -5);
      element.style.setProperty("--scroll-motion-y", `${verticalShift.toFixed(2)}px`);
      element.style.setProperty("--scroll-motion-x", `${horizontalShift.toFixed(2)}px`);
    });
  }
};

const requestScrollUpdate = () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollEffects);
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

const revealGroups = [
  [".section-intro", ""], [".compare-card", "scroll-reveal--scale"],
  [".benefit-item", ""], [".step-card", ""],
  [".offer__media", "scroll-reveal--left"], [".offer__content", "scroll-reveal--right"],
  [".special-offer__copy", "scroll-reveal--left"], [".special-offer__card", "scroll-reveal--right"],
  [".audience-card", ""], [".guarantee-card", "scroll-reveal--scale"],
  [".faq-item", ""], [".final-card__copy", "scroll-reveal--left"],
  [".final-card__visual", "scroll-reveal--right"], [".site-footer__bottom", ""],
];

revealGroups.forEach(([selector, variant]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add("scroll-reveal");
    if (variant) element.classList.add(variant);
    element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 80}ms`);
    revealElements.push(element);
  });
});

if (reducedMotionPreference.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04, rootMargin: "0px 0px -24px 0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
}

updateScrollEffects();

if (stickyCta && hero) {
  const toggleStickyCta = () => {
    stickyCta.classList.toggle("sticky-cta--visible", window.scrollY > hero.offsetHeight * 0.55);
  };
  toggleStickyCta();
  window.addEventListener("scroll", toggleStickyCta, { passive: true });
  window.addEventListener("resize", toggleStickyCta);
}

if (purchaseToast) {
  const purchaseMessages = [
    { title: "Mariana, de Campinas, baixou o kit agora mesmo.", meta: "Compra confirmada há poucos minutos" },
    { title: "Pedro, de Belo Horizonte, acabou de garantir o PDF.", meta: "Atividade recente no checkout" },
    { title: "Ana, de Curitiba, recebeu acesso imediato ao kit.", meta: "Novo pedido aprovado" },
  ];
  const toastTitle = purchaseToast.querySelector(".purchase-toast__title");
  const toastMeta = purchaseToast.querySelector(".purchase-toast__meta");
  let toastIndex = 0;
  let hideTimer = null;
  const hideToast = () => purchaseToast.classList.remove("purchase-toast--visible");
  const showToast = () => {
    const message = purchaseMessages[toastIndex % purchaseMessages.length];
    toastIndex += 1;
    toastTitle.textContent = message.title;
    toastMeta.textContent = message.meta;
    purchaseToast.classList.add("purchase-toast--visible");
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hideToast, 4200);
  };
  if (!reducedMotionPreference.matches) {
    window.setTimeout(() => { showToast(); window.setInterval(showToast, 14000); }, 2200);
  } else {
    toastTitle.textContent = purchaseMessages[0].title;
    toastMeta.textContent = purchaseMessages[0].meta;
  }
}
