(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dotsWrap = slider.querySelector('[data-hero-dots]');
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('button')) : [];
    let current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    showSlide(0);
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  const list = document.querySelector('[data-movie-list]');
  if (list) {
    const cards = Array.from(list.querySelectorAll('.movie-card'));
    const searchInput = document.querySelector('[data-search-input]');
    const categoryFilter = document.querySelector('[data-category-filter]');
    const typeFilter = document.querySelector('[data-type-filter]');
    const yearFilter = document.querySelector('[data-year-filter]');
    const status = document.querySelector('[data-filter-status]');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      const keyword = normalize(searchInput ? searchInput.value : '');
      const category = normalize(categoryFilter ? categoryFilter.value : '');
      const type = normalize(typeFilter ? typeFilter.value : '');
      const year = normalize(yearFilter ? yearFilter.value : '');
      let visible = 0;

      cards.forEach(function (card) {
        const search = normalize(card.getAttribute('data-search'));
        const cardCategory = normalize(card.getAttribute('data-category'));
        const cardType = normalize(card.getAttribute('data-type'));
        const cardYear = normalize(card.getAttribute('data-year'));
        const matched = (!keyword || search.indexOf(keyword) !== -1) &&
          (!category || cardCategory === category) &&
          (!type || cardType === type) &&
          (!year || cardYear === year);

        card.classList.toggle('hidden-by-filter', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (status) {
        status.textContent = visible > 0 ? '筛选结果' : '没有找到匹配的影片';
      }
    }

    [searchInput, categoryFilter, typeFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
}());
