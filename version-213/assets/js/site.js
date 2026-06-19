(function () {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('is-open');
      body.classList.toggle('menu-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let currentSlide = 0;
  let heroTimer = null;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  function startHero() {
    if (slides.length <= 1) {
      return;
    }

    heroTimer = window.setInterval(function () {
      setSlide(currentSlide + 1);
    }, 5200);
  }

  function restartHero() {
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }
    startHero();
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setSlide(index);
      restartHero();
    });
  });

  setSlide(0);
  startHero();

  const params = new URLSearchParams(window.location.search);
  const queryFromUrl = params.get('q') || '';
  const searchPageInput = document.querySelector('[data-search-page-input]');

  if (searchPageInput && queryFromUrl) {
    searchPageInput.value = queryFromUrl;
  }

  const filterInputs = Array.from(document.querySelectorAll('[data-filter-input]'));
  const filterChips = Array.from(document.querySelectorAll('[data-filter-chip]'));
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const emptyMessage = document.querySelector('[data-empty-message]');
  let activeFilter = '';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }

    const words = filterInputs
      .map(function (input) {
        return normalize(input.value);
      })
      .filter(Boolean);

    let visibleCount = 0;

    cards.forEach(function (card) {
      const text = normalize(card.getAttribute('data-search'));
      const category = card.getAttribute('data-category') || '';
      const region = card.getAttribute('data-region') || '';
      const filterMatched = !activeFilter || category === activeFilter || region === activeFilter;
      const wordsMatched = words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
      const visible = filterMatched && wordsMatched;

      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyMessage) {
      emptyMessage.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  filterInputs.forEach(function (input) {
    input.addEventListener('input', applyFilter);
  });

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      activeFilter = chip.getAttribute('data-filter-chip') || '';
      filterChips.forEach(function (item) {
        item.classList.toggle('is-active', item === chip);
      });
      applyFilter();
    });
  });

  applyFilter();
})();
