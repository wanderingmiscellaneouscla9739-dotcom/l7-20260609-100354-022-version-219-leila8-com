(function () {
    var video = document.getElementById("film-player");
    var cover = document.getElementById("film-player-cover");
    var button = document.getElementById("film-player-button");
    var url = window.__videoFile;
    var hls = null;
    var ready = false;

    function prepare() {
        if (!video || !url || ready) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            ready = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            ready = true;
            return;
        }

        video.src = url;
        ready = true;
    }

    function hideCover() {
        if (cover) {
            cover.classList.add("is-hidden");
        }
    }

    function showCover() {
        if (cover) {
            cover.classList.remove("is-hidden");
        }
    }

    function start() {
        prepare();
        hideCover();
        if (!video) {
            return;
        }
        var action = video.play();
        if (action && action.catch) {
            action.catch(function () {
                showCover();
            });
        }
    }

    if (cover) {
        cover.addEventListener("click", start);
    }

    if (button) {
        button.addEventListener("click", start);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("play", hideCover);
    }

    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
})();
