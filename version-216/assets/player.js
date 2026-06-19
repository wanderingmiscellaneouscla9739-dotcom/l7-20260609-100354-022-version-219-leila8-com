(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-video-url]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('.play-overlay');
        var url = player.getAttribute('data-video-url');
        var loaded = false;
        var hls = null;

        var attach = function () {
            if (loaded || !video || !url) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
            loaded = true;
        };

        var play = function () {
            attach();
            player.classList.add('is-playing');
            var started = video.play();
            if (started && typeof started.catch === 'function') {
                started.catch(function () {
                    player.classList.remove('is-playing');
                });
            }
        };

        if (button) {
            button.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (!video.ended) {
                    player.classList.remove('is-playing');
                }
            });
            video.addEventListener('ended', function () {
                player.classList.remove('is-playing');
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
