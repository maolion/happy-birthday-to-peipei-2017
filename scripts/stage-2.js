const Stage2 = (function() {
  const DURATION = 2000;
  const COLORS = {
    RED: '#FF0000',
    CYAN: '#46bffe',
    BLUE: '#0000FF',
    GREEN: '#00FF00',
    WHITE: 'white',
    BROWN: '#ee7600',
    YELLOW: '#FFFF00',
    ORANGE: '#ffd700',
    MAGENTA: '#ff00a8',
  }

  const stageContainerEl = App.stageContainerEl;
  
  const stageCenterPos = App.utils.stageCenterPos();

  let stopped = false;
  let stageEl = document.createElement('DIV');
  let shapeContainerEl = document.createElement('DIV');
  shapeContainerEl.className = 'shape-container';

  // Adding custom shapes

  class FullZero extends mojs.CustomShape {
    getShape() {
      return `<path  d="m1.2,12.4l0.8,-9.4c0.1,-1.1 1.1,-2 2.2,-2l0,0c1,0 1.9,0.8 1.9,1.8c0,0.1 0,0.1 0,0.2l-1,11.6c-0.1,1.1 -1.1,2 -2.2,2l0,0c-1,0 -1.9,-0.8 -1.9,-1.8c0,-0.1 0,-0.1 0,-0.2l0.1,-0.7l0.1,-1.5z"></path>`;
    }
  }
  mojs.addShape('full-zero', FullZero);

  class One extends mojs.CustomShape {
    getShape() {
      return '<path d="M12.18,15.84L13.49,0.73A0.22,0.22,0,0,0,13.1.57L10.65,2.85" transform="translate(-1.23 -0.45)"></path>';
    }
  }
  mojs.addShape('one', One);

  //
  const burstOne = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {
      4: 60,
    },
    x: -100,
    angle: 45,
    count: 14,
    children: {
      degreeShift: 'rand(-360, 360)',
      shape: 'line',
      radius: 3,
      scale: 1,
      stroke: {
        'magenta': 'red',
      },
      strokeDasharray: '100%',
      strokeDashoffset: {
        '-100%': '100%',
      },
      delay: DURATION / 2,
      duration: 1000,
      easing: 'quad.out',
    },
  });

  const burstTwo = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {

      4: 60,
    },
    x: 140,
    y: -100,
    angle: 45,
    count: 14,
    children: {
      shape: 'line',
      radius: 3,
      scale: 1,
      stroke: {
        'yellow': 'green',
      },
      strokeDasharray: '100%',
      strokeDashoffset: {
        '-100%': '100%',
      },
      delay: DURATION / 1.2,
      duration: 1000,
      easing: 'quad.out',
    },
  });

  const burstThree = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {
      4: 60,
    },
    x: 150,
    y: 90,
    angle: 45,
    count: 28,
    children: {
      shape: 'line',
      radius: 4,
      scale: 2,
      isForce3d: true,
      stroke: {
        'colour': 'orange',
      },
      strokeDasharray: '100%',
      strokeDashoffset: {
        '-100%': '100%',
      },
      delay: DURATION * 1.2,
      duration: 1000,
      easing: 'quad.out',
    },
  });

  const burstFour = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {
      4: 50,
    },
    x: 100,
    y: 60,
    count: 21,
    children: {
      shape: 'line',
      degreeShift: 'rand(-360, 360)',
      radius: 3,
      scale: 1,
      isForce3d: true,
      stroke: {
        '#8bf5ff': 'blue',
      },
      strokeDasharray: '100%',
      strokeDashoffset: {
        '-100%': '100%',
      },
      delay: 1.4 * DURATION,
      duration: 1000,
      easing: 'quad.out',
    },
  });

  const burstFive = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {
      0: 70,
    },
    x: -100,
    y: 50,
    angle: 45,
    count: 21,
    children: {
      shape: 'line',
      stroke: ['#FF00FF', '#00FF00', '#00FFFF'],
      duration: 400,
      radius: 60,
      strokeWidth: 3,
      isForce3d: true,
      delay: 1.8 * DURATION,
      duration: 1000,
      easing: 'quad.out',
    },
  });

  const burstSix = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {
      4: 70,
    },
    x: 90,
    y: -100,
    angle: 45,
    count: 21,
    children: {
      shape: 'circle',
      radius: 3,
      scale: {
        1.2: 0,
      },
      fill: {
        'white': 'orange',
      },
      strokeDasharray: '100%',
  
      delay: 2.4 * DURATION,
      duration: 1000,
      easing: 'quad.out',
    },
  });

  const burstSeven = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {
      5: 240,
    },
    x: 7,
    y: 0,
    angle: 45,
    count: 84,
    children: {
      shape: 'line',
      radius: 3,
      scale: 1,
      stroke: 'white',
      strokeDasharray: '100%',
      strokeDashoffset: {
        '-100%': '100%',
      },
      isForce3d: true,
      delay: 2.5 * DURATION,
      duration: 1000,
      easing: 'quad.out',
    },
  });

  const burstSevenplus = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {
      5: 240,
    },
    count: 30,
    timeline: {
      delay: 200
    },
    children: {
      stroke: ['#00FF00', '#FFFF00', '#00FFFF'],
      fill: 'none',
      scale: 1,
      strokeWidth: {
        8: 0,
      },
      radius: {
        'rand(5, 1)': 0,
      },
      degreeShift: 'rand(-50, 50)',
      duration: 450,
      delay: 'rand(0, 250)',
      isForce3d: true,
      delay: 3.1 * DURATION,
      duration: 800,
      easing: 'quad.out',
    },
  });

  const burstSevenplusPlus = new mojs.Burst({
    parent: shapeContainerEl,
    radius: {
      5: 240,
    },
    count: 15,
    timeline: {
      delay: 200,
    },
    children: {
      stroke: ['#00FF00', '#FFFF00', '#00FFFF'],
      fill: 'none',
      scale: 1,
      strokeWidth: {
        8: 0,
      },
      radius: {
        'rand(5, 1)': 0,
      },
      degreeShift: 'rand(-50, 50)',
      duration: 450,
      delay: 'rand(0, 250)',
      isForce3d: true,
      delay: 3.2 * DURATION,
      duration: 800,
      easing: 'quad.out',
    },
  });

  const mOneBottom = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'one',
    fill: 'none',
    stroke: COLORS.RED,
    scale: 11,
    strokeWidth: .2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%'
    },
    duration: DURATION * 1.15,
    y: 420,
    x: 320,
  }).then({
    duration: DURATION * 2.5,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      .2: 0
    },
    easing: 'cubic.out'
  });

  const mOneMiddle = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'one',
    fill: 'none',
  
    stroke: COLORS.YELLOW,
    scale: 11,
    strokeWidth: 0.2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%',
    },
    duration: DURATION * 1.05,
  
    y: 420,
    x: 320,
  }).then({
    duration: DURATION * 2.5,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      0.2: 0,
    },
    easing: 'cubic.out',
  });

  const mOne = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'one',
    fill: 'none',
  
    stroke: COLORS.WHITE,
    scale: 11,
    strokeWidth: 0.2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%'
    },
    duration: DURATION * 1.2,
    y: 420,
    x: 320,
  }).then({
    duration: DURATION * 2.5,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      0.2: 0
    },
    easing: 'cubic.out'
  });

  const mZeroBottom = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'full-zero',
    fill: 'none',
    stroke: COLORS.BROWN,
    scale: 11,
    strokeWidth: .2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%',
    },
    duration: DURATION * 1.8,
    y: 410,
    x: 450,
  }).then({
    duration: DURATION * 1.8,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      0.2: 0,
    },
    easing: 'cubic.out',
  });
  
  const mZeroMiddle = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'full-zero',
    fill: 'none',
    stroke: COLORS.GREEN,
    scale: 11,
    strokeWidth: 0.2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%',
    },
    duration: DURATION * 1.9,
    y: 410,
    x: 450,
  }).then({
    duration: DURATION * 1.8,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      .2: 0
    },
    easing: 'cubic.out'
  });
  
  const mZero = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'full-zero',
    fill: 'none',
    stroke: COLORS.WHITE,
    scale: 11,
    strokeWidth: .2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%'
    },
    duration: DURATION * 2,
    y: 410,
    x: 450,
  }).then({
    duration: DURATION * 1.8,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      .2: 0
    },
    easing: 'cubic.out'
  });

  const dOneBottom = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'one',
    fill: 'none',
    stroke: COLORS.GREEN,
    scale: 11,
    strokeWidth: .2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%'
    },
    duration: DURATION * 2.75,
    y: 420,
    x: 460,
  }).then({
    duration: DURATION,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      .2: 0
    },
    easing: 'cubic.out'
  });

  const dOneMiddle = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'one',
    fill: 'none',
  
    stroke: COLORS.YELLOW,
    scale: 11,
    strokeWidth: 0.2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%',
    },
    duration: DURATION * 2.85,
  
    y: 420,
    x: 460,
  }).then({
    duration: DURATION,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      0.2: 0,
    },
    easing: 'cubic.out',
  });

  const dOne = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'one',
    fill: 'none',
  
    stroke: COLORS.WHITE,
    scale: 11,
    strokeWidth: 0.2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%'
    },
    duration: DURATION * 3,
    y: 420,
    x: 460,
  }).then({
    duration: DURATION / 0.9,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      0.2: 0
    },
    easing: 'cubic.out'
  });

  const dZeroBottom = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'full-zero',
    fill: 'none',
    stroke: COLORS.PINK,
    scale: 11,
    strokeWidth: .2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%',
    },
    duration: DURATION * 3.5,
    y: 410,
    x: 590,
  }).then({
    duration: DURATION / 3.5,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      0.2: 0,
    },
    easing: 'cubic.out',
  });
  
  const dZeroMiddle = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'full-zero',
    fill: 'none',
    stroke: COLORS.MAGENTA,
    scale: 11,
    strokeWidth: 0.2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%',
    },
    duration: DURATION * 3.6,
    y: 410,
    x: 590,
  }).then({
    duration: DURATION / 3.5,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      .2: 0
    },
    easing: 'cubic.out'
  });
  
  const dZero = new mojs.Shape({
    parent: shapeContainerEl,
    shape: 'full-zero',
    fill: 'none',
    stroke: COLORS.WHITE,
    scale: 11,
    strokeWidth: .2,
    strokeDasharray: '100%',
    strokeDashoffset: {
      '-100%': '50%'
    },
    duration: DURATION * 3.7,
    y: 410,
    x: 590,
  }).then({
    duration: DURATION / 3.5,
    easing: 'cubic.out'
  }).then({
    duration: DURATION / 2,
    strokeWidth: {
      .2: 0
    },
    easing: 'cubic.out'
  });

  return {
    start,
    stop,
  };

  function start(next) {
    stageEl.setAttribute('id', 'stage-2');
  
    stageContainerEl.appendChild(stageEl);

    stageEl.appendChild(shapeContainerEl);

    const timeline = new mojs.Timeline({
      speed: 0.95,
      onComplete (isForward) {
        stop();
        
        if (next) {
          next();
        }
      },
    });

    timeline.add(
      burstOne, burstTwo, burstThree, burstFour, burstFive, burstSix, burstSeven, burstSevenplus, burstSevenplusPlus, 
      mOne, mOneBottom, mOneMiddle,
      mZero, mZeroBottom, mZeroMiddle, 
      dOne, dOneBottom, dOneMiddle,
      dZero, dZeroBottom, dZeroMiddle,
    );

    timeline.play();
  }

  function stop() {
    stopped = true;
    stageContainerEl.removeChild(stageEl);
    stageEl = undefined;
  }
})();