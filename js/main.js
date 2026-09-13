// ---------------------------------------------------------------------------
// Skills marquee: seamless loop via cloned items, with a pause/play toggle
// ---------------------------------------------------------------------------
(function () {
  const list = document.getElementById('skillsMarquee');
  const toggle = document.getElementById('skillsToggle');
  if (!list) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    Array.from(list.children).forEach((li) => list.appendChild(li.cloneNode(true)));
    list.classList.add('is-marquee');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isPaused = list.classList.toggle('is-paused');
      toggle.setAttribute('aria-pressed', String(isPaused));
      toggle.setAttribute('aria-label', isPaused ? 'Resume scrolling' : 'Pause scrolling');
    });
  }
})();

// ---------------------------------------------------------------------------
// Hero network graph: subtle parallax that follows the cursor
// ---------------------------------------------------------------------------
(function () {
  const hero = document.querySelector('.hero');
  const graph = document.querySelector('.hero__graph');
  if (!hero || !graph) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    graph.style.transform = `translate(${x * 28}px, ${y * 20}px) scale(1.02)`;
  });
  hero.addEventListener('mouseleave', () => {
    graph.style.transform = '';
  });
})();

// ---------------------------------------------------------------------------
// Fade images in as they finish loading
// ---------------------------------------------------------------------------
(function () {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.classList.add('fade-img');
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
    }
  });
})();

// ---------------------------------------------------------------------------
// Sticky header shadow once the page has scrolled
// ---------------------------------------------------------------------------
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// ---------------------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------------------
(function () {
  const toggle = document.getElementById('navToggle');
  const list = document.getElementById('navList');
  if (!toggle || !list) return;

  toggle.addEventListener('click', () => {
    const isOpen = list.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  list.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      list.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---------------------------------------------------------------------------
// Active nav link highlighting on scroll
// ---------------------------------------------------------------------------
(function () {
  const sections = document.querySelectorAll('main > section[id]');
  const links = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  const linkFor = (id) =>
    Array.from(links).find((link) => link.getAttribute('href') === `#${id}`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
})();

// ---------------------------------------------------------------------------
// Generic scroll-reveal for section intros (About, Contact, Projects heading)
// ---------------------------------------------------------------------------
(function () {
  const targets = document.querySelectorAll('.reveal, .reveal--stagger');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  targets.forEach((el) => observer.observe(el));
})();

// ---------------------------------------------------------------------------
// Project carousel: centers the current slide, peeks neighbors, syncs the
// counter and detail panel; clicking the current slide (or "View project")
// opens the matching case-study dialog.
// ---------------------------------------------------------------------------
(function () {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const viewport = root.querySelector('.project-carousel__viewport');
  const track = root.querySelector('[data-carousel-track]');
  const slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');
  const currentEl = root.querySelector('[data-carousel-current]');
  const totalEl = root.querySelector('[data-carousel-total]');
  const panels = Array.from(root.querySelectorAll('[data-carousel-panel]'));
  if (!viewport || !track || !slides.length) return;

  let index = 0;
  totalEl.textContent = String(slides.length).padStart(2, '0');

  function openDialogFor(id) {
    const dialog = document.getElementById(id);
    if (dialog && typeof window.__openCaseDialog === 'function') window.__openCaseDialog(dialog);
  }

  function render() {
    const slide = slides[index];
    const offset = (viewport.clientWidth - slide.offsetWidth) / 2 - slide.offsetLeft;
    track.style.transform = `translateX(${offset}px)`;
    slides.forEach((s, i) => s.classList.toggle('is-current', i === index));
    panels.forEach((p, i) => { p.hidden = i !== index; });
    currentEl.textContent = String(index + 1).padStart(2, '0');
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (i === index) openDialogFor(slide.dataset.dialog);
      else goTo(i);
    });
    slide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (i === index) openDialogFor(slide.dataset.dialog);
        else goTo(i);
      }
    });
  });

  root.querySelectorAll('[data-carousel-view]').forEach((btn) => {
    btn.addEventListener('click', () => openDialogFor(btn.dataset.dialog));
  });

  window.addEventListener('resize', render);
  render();
})();

// ---------------------------------------------------------------------------
// Case study dialogs
// ---------------------------------------------------------------------------
(function () {
  const cards = document.querySelectorAll('.project-card[data-dialog]');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sectionObservers = new WeakMap();
  const videoObservers = new WeakMap();

  function setUpSectionReveal(dialog) {
    if (prefersReducedMotion || sectionObservers.has(dialog)) return;
    const root = dialog.querySelector('.case-dialog__inner');
    const sections = dialog.querySelectorAll('.case-section');
    if (!root || !sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { root, threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    sectionObservers.set(dialog, observer);
  }

  function setUpVideoAutoplay(dialog) {
    if (videoObservers.has(dialog)) return;
    const root = dialog.querySelector('.case-dialog__inner');
    const videos = dialog.querySelectorAll('video');
    if (!root || !videos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root, threshold: 0.5 }
    );
    videos.forEach((video) => observer.observe(video));
    videoObservers.set(dialog, observer);
  }

  function pauseAllVideos(dialog) {
    dialog.querySelectorAll('video').forEach((video) => video.pause());
  }

  function openDialog(dialog) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    if (prefersReducedMotion) {
      dialog.querySelectorAll('.case-section').forEach((s) => s.classList.add('is-revealed'));
    } else {
      setUpSectionReveal(dialog);
    }
    setUpVideoAutoplay(dialog);
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    dialog.close();
  }

  window.__openCaseDialog = openDialog;

  cards.forEach((card) => {
    const dialog = document.getElementById(card.dataset.dialog);

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let in-card links (e.g. "Live demo") behave normally
      openDialog(dialog);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDialog(dialog);
      }
    });
  });

  document.querySelectorAll('.case-dialog').forEach((dialog) => {
    dialog.querySelectorAll('[data-close-dialog]').forEach((btn) => {
      btn.addEventListener('click', () => closeDialog(dialog));
    });

    // click on the backdrop area (the dialog element itself, not its content) closes it
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeDialog(dialog);
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      pauseAllVideos(dialog);
    });
  });
})();

// ---------------------------------------------------------------------------
// Lightbox for gallery images
// ---------------------------------------------------------------------------
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  if (!lightbox || !lightboxImage) return;

  let currentGroup = [];
  let currentIndex = 0;

  function usableImagesIn(galleryEl) {
    return Array.from(galleryEl.querySelectorAll('.gallery__item:not(.media--missing) img'));
  }

  function show(index) {
    if (!currentGroup.length) return;
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    const img = currentGroup[currentIndex];
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || '';
    const figcaption = img.closest('figure')?.querySelector('figcaption');
    lightboxCaption.textContent = figcaption ? figcaption.textContent : '';
  }

  function openFrom(img) {
    const galleryEl = img.closest('[data-gallery]');
    currentGroup = galleryEl ? usableImagesIn(galleryEl) : [img];
    show(currentGroup.indexOf(img));
    lightbox.showModal();
  }

  document.querySelectorAll('[data-gallery]').forEach((galleryEl) => {
    usableImagesIn(galleryEl).forEach((img) => {
      img.addEventListener('click', () => openFrom(img));
    });
  });

  lightbox.querySelector('[data-close-lightbox]')?.addEventListener('click', () => lightbox.close());
  lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(currentIndex - 1));
  lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });
})();
