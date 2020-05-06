class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vec2) {
    return new Vector2(this.x + vec2.x, this.y + vec2.y);
  }
  subtract(vec2) {
    return new Vector2(this.x - vec2.x, this.y - vec2.y);
  }
}
