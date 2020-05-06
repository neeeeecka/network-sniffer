class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vec2) {
    return new Vector2(this.x + vec2.x, this.y + vec2.y);
  }
  addTo(vec2) {
    this.x += vec2.x;
    this.y += vec2.y;
    return this;
  }
  subtract(vec2) {
    return new Vector2(this.x - vec2.x, this.y - vec2.y);
  }
  subtractFrom(vec2) {
    this.x -= vec2.x;
    this.y -= vec2.y;
    return this;
  }
  multiply(k) {
    return new Vector2(this.x * k, this.y * k);
  }
  multiplyTo(k) {
    this.x *= k;
    this.y *= k;
    return this;
  }
  dot(vec2) {
    return this.x * vec2.x + this.y * vec2.y;
  }
  compareTo(vec2) {
    return this.x === vec2.x && this.y === vec2.y;
  }
  clone() {
    return new Vector2(this.x, this.y);
  }
}
export default Vector2;
