import Vector2 from "./Vector2";

class Rectangle {
  constructor(xy, wh) {
    this.xy = xy;
    this.wh = wh;
  }
  intersectsPoint(point) {
    return (
      point.x >= rect2.xy.x &&
      point.x <= rect2.xy.x + rect2.wh.x &&
      point.y >= rect2.xy.y &&
      point.y <= rect2.xy.y + rect2.wh.y
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
}
export default Rectangle;
