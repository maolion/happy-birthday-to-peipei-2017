const Stage3 = (function() {
  const stageContainerEl = App.stageContainerEl;
  
  let stopped = false;
  let stageEl = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  const STEP_LENGTH = 1;
  const CELL_SIZE = 6;
  const BORDER_WIDTH = 1;
  const MAX_FONT_SIZE = 1000;
  const MAX_MARKED_COUNT = 3;
  const CELL_DISTANCE = CELL_SIZE + BORDER_WIDTH;

  const BG_COLOR = '#1d2227';
  const BORDER_COLOR = '#13191f';
  const CELL_HIGHLIGHT = '#328bf6';
  const ELECTRON_COLOR = '#00b07c';

  const FONT_FAMILY = 'Helvetica, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuan Yi Micro Hei", sans-serif';

  const DPR = window.devicePixelRatio || 1;

  const ACTIVE_ELECTRONS = [];
  const PINNED_CELLS = [];

  const MOVE_TRAILS = [
    [0, 1], // down
    [0, -1], // up
    [1, 0], // right
    [-1, 0]
  ]. // left
    map(function (_ref) {
      const x = _ref[0];
      const y = _ref[1];
      return [x * CELL_DISTANCE, y * CELL_DISTANCE];
    });

  const END_POINTS_OFFSET = [
    [0, 0], // left top
    [0, 1], // left bottom
    [1, 0], // right top
    [1, 1]
  ]. // right bottom
    map(function (_ref2) {
      const x = _ref2[0];
      const y = _ref2[1];
      return [x * CELL_DISTANCE - BORDER_WIDTH / 2, y * CELL_DISTANCE - BORDER_WIDTH / 2];
    });

  const FullscreenCanvas = function () {
    function FullscreenCanvas() {
      const disableScale = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      _classCallCheck(this, FullscreenCanvas);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      this.canvas = canvas;
      this.context = context;
      this.disableScale = disableScale;

      this.resizeHandlers = [];
      this.handleResize = _.debounce(this.handleResize.bind(this), 100);

      this.adjust();

      window.addEventListener('resize', this.handleResize);
    }

    FullscreenCanvas.prototype.adjust = function adjust() {
      const canvas = this.canvas;
      const context = this.context;
      const disableScale = this.disableScale;
      const innerWidth = App.stageContainerEl.clientWidth + 10; 
      const innerHeight = App.stageContainerEl.clientHeight;

      this.width = innerWidth;
      this.height = innerHeight;

      const scale = disableScale ? 1 : DPR;

      this.realWidth = canvas.width = innerWidth * scale;
      this.realHeight = canvas.height = innerHeight * scale;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';

      context.scale(scale, scale);
    };

    FullscreenCanvas.prototype.clear = function clear() {
      const context = this.context;

      context.clearRect(0, 0, this.width, this.height);
    };

    FullscreenCanvas.prototype.makeCallback = function makeCallback(fn) {
      fn(this.context, this);
    };

    FullscreenCanvas.prototype.composeBackground = function composeBackground(background) {
      const opacity = arguments.length <= 1 || arguments[1] === undefined ? 0.1 : arguments[1];

      return this.paint(function (ctx, _ref3) {
        const realWidth = _ref3.realWidth;
        const realHeight = _ref3.realHeight;
        const width = _ref3.width;
        const height = _ref3.height;

        ctx.save();

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = opacity;

        ctx.drawImage(background, 0, 0, realWidth, realHeight, 0, 0, width, height);

        ctx.restore();
      });
    };

    FullscreenCanvas.prototype.paint = function paint(fn) {
      if (!_.isFunction(fn)) return;

      this.makeCallback(fn);

      return this;
    };

    FullscreenCanvas.prototype.repaint = function repaint(fn) {
      if (!_.isFunction(fn)) return;

      this.clear();

      return this.paint(fn);
    };

    FullscreenCanvas.prototype.onResize = function onResize(fn) {
      if (!_.isFunction(fn)) return;

      this.resizeHandlers.push(fn);
    };

    FullscreenCanvas.prototype.handleResize = function handleResize() {
      const resizeHandlers = this.resizeHandlers;

      if (!resizeHandlers.length) return;

      this.adjust();

      resizeHandlers.forEach(this.makeCallback.bind(this));
    };

    FullscreenCanvas.prototype.renderIntoView = function renderIntoView() {
      const zIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      const target = arguments.length <= 1 || arguments[1] === undefined ? document.body : arguments[1];
      const canvas = this.canvas;

      canvas.style.position = 'absolute';
      canvas.style.left = '0px';
      canvas.style.top = '0px';
      canvas.style.zIndex = zIndex;

      target.appendChild(canvas);
    };

    return FullscreenCanvas;
  }();

  const Electron = function () {
    function Electron() {
      const x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      const y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      const _ref4 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      const _ref4$lifeTime = _ref4.lifeTime;
      const lifeTime = _ref4$lifeTime === undefined ? 3 * 1e3 : _ref4$lifeTime;
      const _ref4$speed = _ref4.speed;
      const speed = _ref4$speed === undefined ? STEP_LENGTH : _ref4$speed;
      const _ref4$color = _ref4.color;
      const color = _ref4$color === undefined ? ELECTRON_COLOR : _ref4$color;

      _classCallCheck(this, Electron);

      this.expireAt = Date.now() + lifeTime;
      this.speed = speed;
      this.color = color;
      this.shadowColor = this.buildShadowColor(color);

      this.radius = BORDER_WIDTH / 2;
      this.current = [x, y];
      this.visited = {};
      this.setDest(this.randomPath());
    }

    Electron.prototype.buildShadowColor = function buildShadowColor(color) {
      return 'rgba(' + color.match(/[0-9a-f]{2}/ig).map(function (hex) {
        return parseInt(hex, 16);
      }).join(', ') + ', 0.8)';
    };

    Electron.prototype.randomPath = function randomPath() {
      const _current = this.current;
      const x = _current[0];
      const y = _current[1];
      const length = MOVE_TRAILS.length;

      const _MOVE_TRAILS$_$random = MOVE_TRAILS[_.random(length - 1)];

      const deltaX = _MOVE_TRAILS$_$random[0];
      const deltaY = _MOVE_TRAILS$_$random[1];

      return [x + deltaX, y + deltaY];
    };

    Electron.prototype.composeCoord = function composeCoord(coord) {
      return coord.join(',');
    };

    Electron.prototype.hasVisited = function hasVisited(dest) {
      const key = this.composeCoord(dest);

      return this.visited[key];
    };

    Electron.prototype.setDest = function setDest(dest) {
      this.destination = dest;
      this.visited[this.composeCoord(dest)] = true;
    };

    Electron.prototype.next = function next() {
      const speed = this.speed;
      const current = this.current;
      let destination = this.destination;

      if (Math.abs(current[0] - destination[0]) <= speed / 2 && Math.abs(current[1] - destination[1]) <= speed / 2) {
        destination = this.randomPath();

        let tryCnt = 1;

        while (this.hasVisited(destination) && tryCnt < 10) {
          tryCnt++;
          destination = this.randomPath();
        }

        this.setDest(destination);
      }

      const deltaX = destination[0] - current[0];
      const deltaY = destination[1] - current[1];

      if (deltaX) {
        current[0] += deltaX / Math.abs(deltaX) * speed;
      }

      if (deltaY) {
        current[1] += deltaY / Math.abs(deltaY) * speed;
      }

      return [].concat(this.current);
    };

    Electron.prototype.paintNextTo = function paintNextTo() {
      const _ref5 = arguments.length <= 0 || arguments[0] === undefined ? new FullscreenCanvas() : arguments[0];

      const context = _ref5.context;
      const radius = this.radius;
      const color = this.color;
      const shadowColor = this.shadowColor;

      const _next = this.next();

      const x = _next[0];
      const y = _next[1];

      context.save();

      context.fillStyle = color;
      context.shadowBlur = radius * 5;
      context.shadowColor = shadowColor;
      context.globalCompositeOperation = 'lighter';

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.closePath();

      context.fill();

      context.restore();
    };

    return Electron;
  }();

  const Cell = function () {
    function Cell() {
      const lineIdx = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      const rowIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      const _ref6 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      const _ref6$electronCount = _ref6.electronCount;
      const electronCount = _ref6$electronCount === undefined ? _.random(2, END_POINTS_OFFSET.length - 1) : _ref6$electronCount;
      const _ref6$background = _ref6.background;
      const background = _ref6$background === undefined ? CELL_HIGHLIGHT : _ref6$background;
      const _ref6$electronOptions = _ref6.electronOptions;
      const electronOptions = _ref6$electronOptions === undefined ? {} : _ref6$electronOptions;

      _classCallCheck(this, Cell);

      this.background = background;
      this.electronCount = electronCount;
      this.electronOptions = electronOptions;
      this.startX = lineIdx * CELL_DISTANCE;
      this.startY = rowIndex * CELL_DISTANCE;
    }

    Cell.prototype.pin = function pin() {
      const lifeTime = arguments.length <= 0 || arguments[0] === undefined ? -1 >>> 1 : arguments[0];

      this.expireAt = Date.now() + lifeTime;

      PINNED_CELLS.push(this);
    };

    Cell.prototype.scheduleUpdate = function scheduleUpdate() {
      this.nextUpdate = Date.now() + _.random(300, 500);
    };

    Cell.prototype.paintNextTo = function paintNextTo() {
      const _ref7 = arguments.length <= 0 || arguments[0] === undefined ? new FullscreenCanvas() : arguments[0];

      const context = _ref7.context;
      const startX = this.startX;
      const startY = this.startY;
      const background = this.background;
      const nextUpdate = this.nextUpdate;

      if (nextUpdate && Date.now() < nextUpdate) return;

      this.scheduleUpdate();
      this.createElectrons();

      context.save();

      context.globalCompositeOperation = 'lighter';
      context.fillStyle = background;
      context.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);

      context.restore();
    };

    Cell.prototype.popRandom = function popRandom() {
      const arr = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      const ramIdx = _.random(arr.length - 1);

      return arr.splice(ramIdx, 1)[0];
    };

    Cell.prototype.createElectrons = function createElectrons() {
      const startX = this.startX;
      const startY = this.startY;
      const electronCount = this.electronCount;
      const electronOptions = this.electronOptions;

      if (!electronCount) return;

      const endpoints = [].concat(END_POINTS_OFFSET);

      for (let i = 0; i < electronCount; i++) {
        const _popRandom = this.popRandom(endpoints);

        const offsetX = _popRandom[0];
        const offsetY = _popRandom[1];

        ACTIVE_ELECTRONS.push(new Electron(startX + offsetX, startY + offsetY, electronOptions));
      }
    };

    return Cell;
  }();

  const mainLayer = new FullscreenCanvas();
  const bgLayer = new FullscreenCanvas();

  function iterateItemsIn(list) {
    const now = Date.now();

    for (let i = 0, max = list.length; i < max; i++) {
      const item = list[i];

      if (now >= item.expireAt) {
        list.splice(i, 1);
        i--;
        max--;
      } else {
        item.paintNextTo(mainLayer);
      }
    }
  }

  function drawMain() {
    iterateItemsIn(PINNED_CELLS);
    iterateItemsIn(ACTIVE_ELECTRONS);
  }

  function drawGrid() {
    const ctx = arguments.length <= 0 || arguments[0] === undefined ? bgLayer.context : arguments[0];

    const _ref8 = arguments.length <= 1 || arguments[1] === undefined ? bgLayer : arguments[1];

    const width = _ref8.width;
    const height = _ref8.height;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = BORDER_COLOR;

    // horizontal lines
    for (let h = CELL_SIZE; h < height; h += CELL_DISTANCE) {
      ctx.fillRect(0, h, width, BORDER_WIDTH);
    }

    // vertical lines
    for (let w = CELL_SIZE; w < width; w += CELL_DISTANCE) {
      ctx.fillRect(w, 0, BORDER_WIDTH, height);
    }
  }

  function randomCell(options) {
    const width = mainLayer.width;
    const height = mainLayer.height;

    const cell = new Cell(_.random(width / CELL_DISTANCE), _.random(height / CELL_DISTANCE), options);

    cell.paintNextTo(mainLayer);
  }

  bgLayer.paint(drawGrid);
  bgLayer.onResize(drawGrid);

  mainLayer.paint(drawMain);
  mainLayer.onResize(drawMain);

  function loop() {
    if (stopped) {
      return;
    } 

    mainLayer.composeBackground(bgLayer.canvas);

    drawMain();

    requestAnimationFrame(loop);
  }

  const clickCount = 0;

  const resetClickCount = _.debounce(function () {
    clickCount = 0;
  }, 300);

  function renderPointer(_ref9) {
    const clientX = _ref9.clientX;
    const clientY = _ref9.clientY;

    if (++clickCount === 10) {
      clickCount = 0;
      mainLayer.clear();
    } else {
      resetClickCount();
    }

    const cell = new Cell(Math.floor(clientX / CELL_DISTANCE), Math.floor(clientY / CELL_DISTANCE), {
      electronCount: 4,
      background: '#ff5353',
      electronOptions: {
        speed: 2,
        lifeTime: 1500,
        color: '#ff5353'
      }
    });

    cell.paintNextTo(mainLayer);
  }

  let timerHandle = undefined;
  // shape builder

  const shape = {
    lastText: '',
    lastMatrix: null,
    appendQueueID: undefined,
    layer: new FullscreenCanvas(true),

    init: function init() {
      const _this = this;

      this.layer.onResize(function () {
        if (_this.lastText) {
          _this.print(_this.lastText);
        }
      });
    },
    getTextMatrix: function getTextMatrix(text) {
      const _ref10 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      const _ref10$fontWeight = _ref10.fontWeight;
      const fontWeight = _ref10$fontWeight === undefined ? 'bold' : _ref10$fontWeight;
      const _ref10$fontFamily = _ref10.fontFamily;
      const fontFamily = _ref10$fontFamily === undefined ? FONT_FAMILY : _ref10$fontFamily;
      const layer = this.layer;
      const width = layer.width;
      const height = layer.height;

      layer.repaint(function (ctx) {

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = fontWeight + ' ' + MAX_FONT_SIZE + 'px ' + fontFamily;

        const scale = width / ctx.measureText(text).width;
        const fontSize = Math.min(MAX_FONT_SIZE, MAX_FONT_SIZE * scale * 0.8);

        ctx.font = fontWeight + ' ' + fontSize + 'px ' + fontFamily;

        ctx.fillText(text, width / 2, height / 2);
      });

      const pixels = layer.context.getImageData(0, 0, width, height).data;
      const matrix = [];

      for (let y = 0; y < height; y += CELL_DISTANCE) {
        for (let x = 0; x < width; x += CELL_DISTANCE) {
          const alpha = pixels[(x + y * width) * 4 + 3];

          if (alpha > 0) matrix.push([x, y]);
        }
      }

      return matrix;
    },
    print: function print(text, options) {
      const _this2 = this;

      this.clear();

      this.lastText = text;

      const matrix = this.lastMatrix = _.shuffle(this.getTextMatrix(text, options));

      let i = 0,
        max = matrix.length;

      let markedCount = 0;

      const append = function append() {
        const count = _.random(Math.floor(max / 20), Math.floor(max / 10));

        let j = 0;

        while (j < count && i < max) {
          const _matrix$i = matrix[i];
          const x = _matrix$i[0];
          const y = _matrix$i[1];

          const isMarked = markedCount < MAX_MARKED_COUNT;

          const cell = new Cell(Math.floor(x / CELL_DISTANCE), Math.floor(y / CELL_DISTANCE), {
            // electronCount: 1, // ff low pref
            electronCount: isMarked ? 4 : 0,
            background: '#ff5353',
            electronOptions: {
              speed: 2,
              lifeTime: isMarked ? 1000 : 100,
              color: '#ff5353'
            }
          });

          cell.paintNextTo(mainLayer);
          cell.pin();

          markedCount++;
          i++;
          j++;
        }

        _this2.appendQueueID = setTimeout(append, _.random(50, 100));
      };

      append();
    },
    explosion: function explosion() {
      const lastMatrix = this.lastMatrix;

      const options = {
        electronCount: 4,
        background: '#ff5353',
        electronOptions: {
          speed: 2,
          lifeTime: 1000,
          color: '#ff5353'
        }
      };

      if (lastMatrix) {
        let max = _.random(Math.floor(lastMatrix.length / 20), Math.floor(lastMatrix.length / 10));

        max = Math.max(20, Math.min(100, max));

        for (let i = 0; i < max; i++) {
          const _lastMatrix$i = lastMatrix[i];
          const x = _lastMatrix$i[0];
          const y = _lastMatrix$i[1];

          const cell = new Cell(Math.floor(x / CELL_DISTANCE), Math.floor(y / CELL_DISTANCE), options);

          cell.paintNextTo(mainLayer);
        }
      } else {
        const max = _.random(10, 20);

        for (let i = 0; i < max; i++) {
          randomCell(options);
        }
      }
    },
    clear: function clear() {
      this.explosion();

      clearTimeout(this.appendQueueID);

      this.appendQueueID = undefined;
      this.lastMatrix = null;
      this.lastText = '';
      PINNED_CELLS.length = 0;
    }
  };

  return {
    start,
    stop,
  };

  function start(next) {
    stageEl = document.createElement('DIV');
    stageEl.setAttribute('id', 'stage-3');
  
    stageContainerEl.appendChild(stageEl);

    bgLayer.renderIntoView(0, stageEl);
    mainLayer.renderIntoView(1, stageEl);

    loop();
    

    shape.init();
    
    setTimeout(() => {
      ['生日', '快乐', '天天', '都要', '开开', '心心', '☺', '我', '爱', '你', '女', '王', '大', '人', '♕', '❤'].forEach((item, i) => {
        // let speed = i < 4 ? 2000 : 3000;
  
        // if (i > 10) {
        //   speed = 2000;
        // }
  
        // if (i > 13) {
        //   speed = 3000;
        // }
  
        setTimeout(() => {
          shape.print(item)
        }, 3000 * i);
    }, 2000);
    })

    // shape.print('佩');

    timerHandle = setInterval(randomCell, 1024 / Math.floor(Math.sqrt(mainLayer.width * mainLayer.height)) * 500);
  }

  function stop() {
    stopped = true;
    stageContainerEl.removeChild(stageEl);
    stageEl = undefined;
    clearInterval(timerHandle);
  }
})();