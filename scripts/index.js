App.backgroundAudio.play();

// App.backgroundAudio.addEventListener('ended', () => {
//   setTimeout(() => location.reload(), 1000);
// });

Stage1.start(() => {
  Stage2.start(() => {
    Stage3.start();
  });
});