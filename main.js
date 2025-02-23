// Animações ao scroll com Intersection Observer
const animateOnScroll = () => {
  const elements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px",
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
};

// Scroll suave para links do menu
const smoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Fecha o menu mobile se estiver aberto
      if (document.querySelector(".nav-links.active")) {
        document.querySelector(".nav-links").classList.remove("active");
        document.querySelector(".menu-mobile").classList.remove("active");
      }
    });
  });
};

// Menu ativo no scroll
const activeMenuOnScroll = () => {
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document
          .querySelector(`.nav-links a[href="#${sectionId}"]`)
          ?.classList.add("active");
      } else {
        document
          .querySelector(`.nav-links a[href="#${sectionId}"]`)
          ?.classList.remove("active");
      }
    });
  });
};

// Menu Mobile
const initMobileMenu = () => {
  const menuButton = document.querySelector(".menu-mobile");
  const navLinks = document.querySelector(".nav-links");

  menuButton?.addEventListener("click", () => {
    menuButton.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Fecha o menu ao clicar em um link
  document.querySelectorAll(".nav-links a, .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Fecha o menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (
      !menuButton.contains(e.target) &&
      !navLinks.contains(e.target) &&
      navLinks.classList.contains("active")
    ) {
      menuButton.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
};

// FAQ Accordion
const initFaqAccordion = () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = question.querySelector(".faq-icon");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Fecha todos os outros itens
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-answer").style.height = "0px";
          otherItem.querySelector(".faq-icon").textContent = "+";
        }
      });

      // Toggle do item atual
      item.classList.toggle("active");

      if (!isOpen) {
        answer.style.height = answer.scrollHeight + "px";
        icon.textContent = "−";
      } else {
        answer.style.height = "0px";
        icon.textContent = "+";
      }
    });
  });
};

// Parallax Effect
const initParallax = () => {
  const parallaxElements = document.querySelectorAll(".parallax");

  window.addEventListener("scroll", () => {
    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(window.pageYOffset * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
};

// Adicione esta função junto com as outras
const handleHeaderTransparency = () => {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
};

// Preloader otimizado
const handlePreloader = () => {
  const preloader = document.querySelector(".preloader");
  const content = document.body;

  // Pré-carrega recursos críticos
  const preloadImages = ["/img/logo.png", "/img/img-dra.png"];

  const preloadPromises = preloadImages.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  });

  // Remove preloader quando recursos críticos estiverem carregados
  Promise.all(preloadPromises)
    .then(() => {
      setTimeout(() => {
        preloader.style.opacity = "0";
        content.style.overflow = "visible";

        setTimeout(() => {
          preloader.remove();
        }, 300);
      }, 2000);
    })
    .catch((error) => {
      console.warn("Erro ao carregar recursos:", error);
      // Remove preloader mesmo em caso de erro
      preloader.remove();
      content.style.overflow = "visible";
    });
};

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  animateOnScroll();
  smoothScroll();
  activeMenuOnScroll();
  initMobileMenu();
  initFaqAccordion();
  initParallax();
  handleHeaderTransparency();

  // Otimização do Preloader
  const preloader = document.querySelector(".preloader");
  const content = document.querySelector("body");

  // Oculta o preloader assim que o conteúdo básico estiver carregado
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("fade-out");
      content.style.overflow = "visible";

      setTimeout(() => {
        preloader.remove();
      }, 300);
    }, 2000);
  }

  // Otimização de carregamento de imagens
  const lazyImages = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));

  // Inicializa preloader
  handlePreloader();
});
