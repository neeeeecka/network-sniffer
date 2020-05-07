import Vector2 from "./Vector2";
import ReactDOMServer from "react-dom/server";

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
  debug(color) {
    console.log(document);
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
      />
    );
    const debugEl = document.getElementById("rectDebugger");
    debugEl.innerHTML += ReactDOMServer.renderToString(rectEl);
    // el.style.width = this.wh.x;
    // el.style.height = this.wh.y;
  }
}
export default Rectangle;
