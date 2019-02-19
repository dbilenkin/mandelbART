export function getRandomColor() {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
}

export function getLeftOrRight() {
  return Math.random() > 0.5 ? "left" : "right";
}
