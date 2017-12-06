const Stage1 = (function() {
  const stageContainerEl = App.stageContainerEl;
  const starStyles = ['white', 'red', 'blue', 'orange'];

  const stageCenterPos = App.utils.stageCenterPos();
  const minX = stageCenterPos.x + 100;
  const maxX = stageCenterPos.x + 300;
  const minY = stageCenterPos.y - 400;
  const maxY = stageCenterPos.y - 300;

  let stopped = false;
  let stageEl = undefined;

  return {
    start,
    stop,
  };

  function start(next) {
    stageEl = document.createElement('DIV');
    stageEl.setAttribute('id', 'stage-1');
  
    stageContainerEl.appendChild(stageEl);

    generateStar();

    setTimeout(() => addWord('有一个秘密想告诉你', 5000), 1700);
    setTimeout(() => addWord('今天是个特别的日子', 6000), 7600);
    setTimeout(() => {
      stopped = true;

      stageEl.classList.add('leave');
      setTimeout(stop, 1000);
    }, 20000);

    setTimeout(next, 14800)
  }

  function stop() {
    stopped = true;
    stageContainerEl.removeChild(stageEl);
    stageEl = undefined;
  }

  function generateStar() {
    const count = 4;
    
    for (let i = 0; i < count; i++) {
      addStar(starStyles[i]);
    }
  }

  function addWord(word, duration) {
    const wordEl = document.createElement('DIV');
    wordEl.className = 'word';

    wordEl.innerHTML = word;

    stageEl.appendChild(wordEl);

    setTimeout(() => wordEl.classList.add('leave'), duration)
  }

  function addStar(style) {
    const starEl = document.createElement('DIV');
    
    starEl.className = `star ${style}`;

    starEl.addEventListener('animationiteration', () => {
      resetStarPos(starEl);
      starEl.classList.add('inactive');

      if (stopped) {
        return;
      }

      setTimeout(
        () => starEl.classList.remove('inactive'), 
        [1000, 2000, 3000][App.utils.randomNumber(0, 2)],
      ); 
    });

    resetStarPos(starEl)

    stageEl.appendChild(starEl);
  }

  function resetStarPos(starEl) {
    starEl.style.left = `${App.utils.randomNumber(minX, maxX)}px`;
    starEl.style.top = `${App.utils.randomNumber(minY, maxY)}px`;
  }
})();