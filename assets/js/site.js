(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var searchParams = new URLSearchParams(window.location.search);
    var queryValue = searchParams.get("q") || "";

    document.querySelectorAll("[data-filter-root]").forEach(function (root) {
        var input = root.querySelector("[data-search-input]");
        var selects = root.querySelectorAll("[data-filter-select]");
        var cards = Array.prototype.slice.call(root.querySelectorAll("[data-movie-card]"));
        var empty = root.querySelector("[data-no-result]");

        if (input && queryValue) {
            input.value = queryValue;
        }

        function normalize(value) {
            return (value || "").toString().trim().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : "");
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-type"),
                    card.textContent
                ].join(" "));

                var matched = !keyword || text.indexOf(keyword) !== -1;

                selects.forEach(function (select) {
                    var field = select.getAttribute("data-filter-select");
                    var expected = normalize(select.value);
                    var actual = normalize(card.getAttribute("data-" + field));
                    if (expected && actual !== expected) {
                        matched = false;
                    }
                });

                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        selects.forEach(function (select) {
            select.addEventListener("change", applyFilter);
        });

        applyFilter();
    });
})();
