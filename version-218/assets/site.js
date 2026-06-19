(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
      return;
    }
    fn();
  }

  function initMobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length === 0) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var next = parseInt(dot.getAttribute("data-hero-dot"), 10);
        show(next);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initSearchFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-search-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var category = scope.querySelector("[data-category-filter]");
      var year = scope.querySelector("[data-year-filter]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-search-card]"));
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q") || "";
      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function filter() {
        var q = input ? input.value.trim().toLowerCase() : "";
        var c = category ? category.value : "";
        var y = year ? year.value : "";
        cards.forEach(function (card) {
          var content = card.getAttribute("data-search") || "";
          var cardCategory = card.getAttribute("data-category") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var matched = true;
          if (q && content.indexOf(q) === -1) {
            matched = false;
          }
          if (c && cardCategory !== c) {
            matched = false;
          }
          if (y && cardYear !== y) {
            matched = false;
          }
          card.classList.toggle("is-hidden", !matched);
        });
      }

      [input, category, year].forEach(function (el) {
        if (el) {
          el.addEventListener("input", filter);
          el.addEventListener("change", filter);
        }
      });
      filter();
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector("[data-play-button]");
      var status = box.querySelector("[data-player-status]");
      var source = box.getAttribute("data-source");
      var hls = null;
      var loaded = false;

      function setStatus(message) {
        if (status) {
          status.textContent = message;
        }
      }

      function attachSource() {
        if (!video || !source || loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          setStatus("正在连接高清播放源");
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setStatus("播放源已加载");
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setStatus("播放源连接中");
            }
          });
          return;
        }
        video.src = source;
        setStatus("正在连接高清播放源");
      }

      function play() {
        attachSource();
        if (!video) {
          return;
        }
        var promise = video.play();
        box.classList.add("playing");
        setStatus("正在播放");
        if (promise && promise.catch) {
          promise.catch(function () {
            box.classList.remove("playing");
            setStatus("点击视频控件继续播放");
          });
        }
      }

      if (button) {
        button.addEventListener("click", play);
      }
      if (video) {
        video.addEventListener("play", function () {
          box.classList.add("playing");
          setStatus("正在播放");
        });
        video.addEventListener("pause", function () {
          if (!video.ended) {
            box.classList.remove("playing");
            setStatus("已暂停");
          }
        });
        video.addEventListener("ended", function () {
          box.classList.remove("playing");
          setStatus("播放完成");
        });
      }
    });
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initSearchFilters();
    initPlayers();
  });
})();
