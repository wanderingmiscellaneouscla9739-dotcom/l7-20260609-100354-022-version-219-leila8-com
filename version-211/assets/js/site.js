(function () {
    var body = document.body;
    var header = document.querySelector('[data-header]');
    var toggle = document.querySelector('[data-nav-toggle]');

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 40) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (toggle) {
        toggle.addEventListener('click', function () {
            body.classList.toggle('nav-open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                return;
            }
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var active = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === active);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        clearInterval(timer);
        timer = setInterval(function () {
            showSlide(active + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
            startHero();
        });
    });

    showSlide(0);
    startHero();

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function filterCards(scope) {
        var input = scope.querySelector('[data-filter-input]');
        var grid = scope.querySelector('[data-filter-grid]');
        if (!grid) {
            return;
        }
        var q = normalize(input ? input.value : '');
        var activePill = scope.querySelector('.filter-pill.is-active');
        var type = activePill ? normalize(activePill.getAttribute('data-filter-value')) : '';
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta'));
            var cardType = normalize(card.getAttribute('data-type'));
            var typeMatch = !type || type === 'all' || cardType.indexOf(type) !== -1;
            var queryMatch = !q || text.indexOf(q) !== -1;
            card.classList.toggle('is-hidden', !(typeMatch && queryMatch));
        });
    }

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        if (input) {
            input.addEventListener('input', function () {
                filterCards(scope);
            });
        }
        scope.querySelectorAll('.filter-pill').forEach(function (pill) {
            pill.addEventListener('click', function () {
                scope.querySelectorAll('.filter-pill').forEach(function (item) {
                    item.classList.remove('is-active');
                });
                pill.classList.add('is-active');
                filterCards(scope);
            });
        });
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
            filterCards(scope);
        }
    });
})();
