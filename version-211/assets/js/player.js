(function () {
    function loadPlayer(box) {
        var video = box.querySelector('video');
        var overlay = box.querySelector('.player-overlay');
        if (!video) {
            return;
        }
        var src = video.getAttribute('data-src');
        var ready = false;
        var hls = null;

        function bindSource() {
            if (ready || !src) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(src);
                hls.attachMedia(video);
            } else {
                video.src = src;
            }
            ready = true;
        }

        function startPlayback() {
            bindSource();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            video.setAttribute('controls', 'controls');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        video.addEventListener('click', function () {
            if (!ready) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.querySelectorAll('.movie-player').forEach(loadPlayer);
})();
