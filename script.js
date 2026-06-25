const CHECKOUT_URL = "https://seu-link-de-checkout-aqui.com";

const hasRealCheckout =
  typeof CHECKOUT_URL === "string" &&
  CHECKOUT_URL.trim() !== "" &&
  !CHECKOUT_URL.includes("seu-link-de-checkout-aqui");

document.querySelectorAll("[data-checkout]").forEach((element) => {
  element.addEventListener("click", (event) => {
    if (!hasRealCheckout) {
      return;
    }

    event.preventDefault();
    window.location.href = CHECKOUT_URL;
  });
});

const stickyCta = document.querySelector(".sticky-cta");
const hero = document.querySelector(".hero");
const purchaseToast = document.querySelector(".purchase-toast");

if (stickyCta && hero) {
  const toggleStickyCta = () => {
    const triggerPoint = hero.offsetHeight * 0.55;
    stickyCta.classList.toggle("sticky-cta--visible", window.scrollY > triggerPoint);
  };

  toggleStickyCta();
  window.addEventListener("scroll", toggleStickyCta, { passive: true });
  window.addEventListener("resize", toggleStickyCta);
}

if (purchaseToast) {
  const purchaseMessages = [
    {
      title: "Mariana, de Campinas, baixou o kit agora mesmo.",
      meta: "Compra confirmada há poucos minutos",
    },
    {
      title: "Pedro, de Belo Horizonte, acabou de garantir o PDF.",
      meta: "Atividade recente no checkout",
    },
    {
      title: "Ana, de Curitiba, recebeu acesso imediato ao kit.",
      meta: "Novo pedido aprovado",
    },
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const toastTitle = purchaseToast.querySelector(".purchase-toast__title");
  const toastMeta = purchaseToast.querySelector(".purchase-toast__meta");
  let toastIndex = 0;
  let hideTimer = null;

  const hideToast = () => {
    purchaseToast.classList.remove("purchase-toast--visible");
  };

  const showToast = () => {
    const message = purchaseMessages[toastIndex % purchaseMessages.length];
    toastIndex += 1;

    toastTitle.textContent = message.title;
    toastMeta.textContent = message.meta;
    purchaseToast.classList.add("purchase-toast--visible");

    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hideToast, 4200);
  };

  if (!reducedMotion.matches) {
    window.setTimeout(() => {
      showToast();

      window.setInterval(() => {
        showToast();
      }, 14000);
    }, 2200);
  } else {
    const first = purchaseMessages[0];
    toastTitle.textContent = first.title;
    toastMeta.textContent = first.meta;
  }
}
