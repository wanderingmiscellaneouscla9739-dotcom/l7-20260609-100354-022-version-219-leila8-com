import { H as Hls } from './hls-dru42stk.js';

export function initPlayer(source) {
  const video = document.getElementById('movie-video');
  const overlay = document.getElementById('player-overlay');

  if (!video || !source) {
    return;
  }

  let hls = null;

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  } else if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(source);
    hls.attachMedia(video);
  } else {
    video.src = source;
  }

  async function playVideo() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    try {
      await video.play();
    } catch (error) {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    }
  }

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 && overlay) {
      overlay.classList.remove('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
