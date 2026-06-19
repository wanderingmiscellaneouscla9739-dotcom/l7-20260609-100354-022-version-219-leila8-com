(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    if (menuButton) {
        menuButton.addEventListener('click', function () {
            document.body.classList.toggle('menu-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        var showSlide = function (index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        var start = function () {
            stop();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        };

        var stop = function () {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    var normalize = function (value) {
        return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
    };

    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    var applyFilter = function () {
        var terms = inputs.map(function (input) {
            return normalize(input.value);
        }).filter(Boolean);
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute('data-search'));
            var matched = terms.every(function (term) {
                return haystack.indexOf(term) !== -1;
            });
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    };

    inputs.forEach(function (input) {
        input.addEventListener('input', applyFilter);
    });

    var list = document.querySelector('[data-card-list]');
    var sortSelect = document.querySelector('[data-sort-select]');
    if (list && sortSelect) {
        var original = Array.prototype.slice.call(list.children);
        sortSelect.addEventListener('change', function () {
            var value = sortSelect.value;
            var items = original.slice();
            if (value === 'year-desc') {
                items.sort(function (a, b) {
                    return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
                });
            }
            if (value === 'year-asc') {
                items.sort(function (a, b) {
                    return Number(a.getAttribute('data-year') || 0) - Number(b.getAttribute('data-year') || 0);
                });
            }
            if (value === 'title') {
                items.sort(function (a, b) {
                    return normalize(a.getAttribute('data-search')).localeCompare(normalize(b.getAttribute('data-search')), 'zh-Hans-CN');
                });
            }
            items.forEach(function (item) {
                list.appendChild(item);
            });
            applyFilter();
        });
    }
})();
