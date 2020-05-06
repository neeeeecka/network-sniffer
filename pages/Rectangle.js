class Rectangle {
  constructor(xy, wh) {
    this.xy = xy;
    this.wh = wh;
  }
  intersects(rect1, rect2) {
    return (
      rect1.xy.x >= rect2.xy.x &&
      rect1.xy.x <= rect2.xy.x + rect2.wh.x &&
      rect1.xy.y >= rect2.xy.y &&
      rect1.xy.y <= rect2.xy.y + rect2.wh.y
    );
  }
}
