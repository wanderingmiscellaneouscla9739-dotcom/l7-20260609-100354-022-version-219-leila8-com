import { H as Hls } from './hls-vendor.js';

const video = document.querySelector('[data-video-url]');
const button = document.querySelector('[data-play-button]');

if (video) {
  const source = video.getAttribute('data-video-url');
  let hls = null;

  if (source && Hls && Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (!data || !data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
      }
    });
  } else if (source && video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  }

  function hideButton() {
    if (button) {
      button.classList.add('is-hidden');
    }
  }

  function showButton() {
    if (button && video.paused) {
      button.classList.remove('is-hidden');
    }
  }

  if (button) {
    button.addEventListener('click', function () {
      hideButton();
      const playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          showButton();
        });
      }
    });
  }

  video.addEventListener('play', hideButton);
  video.addEventListener('pause', showButton);
  video.addEventListener('ended', showButton);

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
