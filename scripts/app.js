const App = (function() {
  const stageContainerEl = document.querySelector('#stage-container');
  const backgroundAudio = document.querySelector('#background-audio');

  return {
    stageContainerEl,
    backgroundAudio,
    utils: {
      randomNumber(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
      },

      stageCenterPos() {
        return {
          x: stageContainerEl.clientWidth / 2,
          y: stageContainerEl.clientHeight / 2,
        };
      },
    }
  };
})();