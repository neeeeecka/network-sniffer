import Vector2 from "./Vector2";
import ReactDOMServer from "react-dom/server";
import FrameHandler from "./FrameHandler";

class Rectangle {
  constructor(xy, wh) {
    this.xy = xy;
    this.wh = wh;
  }
  intersectsPoint(point) {
    return (
      point.x >= this.xy.x &&
      point.x <= this.xy.x + this.wh.x &&
      point.y >= this.xy.y &&
      point.y <= this.xy.y + this.wh.y
    );
  }
  intersectsWithOffset(rect2, offset) {
    return (
      this.xy.x + offset.x < rect2.xy.x + rect2.wh.x &&
      this.xy.x + offset.x + this.wh.x > rect2.xy.x &&
      this.xy.y + offset.y < rect2.xy.y + rect2.wh.y &&
      this.xy.y + offset.y + this.wh.y > rect2.xy.y
    );
  }
  intersects(rect2) {
    return (
      this.xy.x < rect2.xy.x + rect2.wh.x &&
      this.xy.x + this.wh.x > rect2.xy.x &&
      this.xy.y < rect2.xy.y + rect2.wh.y &&
      this.xy.y + this.wh.y > rect2.xy.y
    );
  }
  clone() {
    return new Rectangle(
      new Vector2(this.xy.x, this.xy.y),
      new Vector2(this.wh.x, this.wh.y)
    );
  }
  debugAt(debugId) {
    const rectDomEl = document.getElementById(debugId);
    if (rectDomEl) {
      rectDomEl.style.transform = `translate(${this.xy.x}px, ${this.xy.y}px)`;
    }
  }
  debugEnd(debugId) {
    const rectDomEl = document.getElementById(debugId);
    if (rectDomEl) {
      rectDomEl.remove();
    }
  }
  debug(color) {
    const debugId = "rectDebug-" + makeid(5);
    const rectEl = (
      <div
        style={{
          background: color,
          width: this.wh.x,
          height: this.wh.y,
          transform: `translate(${this.xy.x}px, ${this.xy.y}px)`,
          pointerEvents: "none",
          position: "absolute",
          zIndex: 12
        }}
        id={debugId}
      />
    );
    const debugEl = document.getElementById("rectDebugger");
    debugEl.innerHTML += ReactDOMServer.renderToString(rectEl);
    const rectDomEl = document.getElementById(debugId);
    // el.style.width = this.wh.x;
    // el.style.height = this.wh.y;

    return debugId;
    const update = deltaTime => {
      rectDomEl.style.transform = `translate(${this.xy.x}px, ${this.xy.y}px)`;
    };
    if (!window.debugFrameHandler) {
      const frameHandler = new FrameHandler(15, update, debugId);
      window.debugFrameHandler = frameHandler;
      console.log(window.debugFrameHandler);
    } else {
      window.debugFrameHandler.addUpdate(update, debugId);
    }
  }
}
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export default Rectangle;
