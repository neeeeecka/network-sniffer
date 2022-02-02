class FrameHandler {
  binds = {};
  constructor(fps, fn, debugId = "default") {
    this.binds[debugId] = fn;
    var fpsInterval, now, then, elapsed;
    fpsInterval = 1000 / fps;
    then = Date.now();
    const animate = () => {
      window.requestAnimationFrame(animate);
      now = Date.now();
      elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        // fn(elapsed / 1000);
        Object.keys(this.binds).forEach(key => {
          this.binds[key](elapsed / 1000);
        });
      }
    };
    animate();
    return true;
  }
  addUpdate = (fn, debugId) => {
    this.binds[debugId] = fn;
  };
}
export default FrameHandler;
