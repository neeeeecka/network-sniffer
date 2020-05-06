class FrameHandler {
  constructor(fps, fn) {
    var fpsInterval, now, then, elapsed;
    fpsInterval = 1000 / fps;
    then = Date.now();
    const animate = () => {
      window.requestAnimationFrame(animate);
      now = Date.now();
      elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        fn(elapsed / 1000);
      }
    };
    animate();
    return true;
  }
}
export default FrameHandler;
