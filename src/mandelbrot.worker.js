const squareC = c => {
  const a = c.a * c.a - c.b * c.b;
  const b = 2 * c.a * c.b;
  return { a, b };
};

const mandelbrot = (c, m) => {
  let z = { a: 0, b: 0 };
  for (let i = 0; i < m.iterations; i++) {
    const { a, b } = squareC(z);
    z.a = a + c.a;
    z.b = b + c.b;
    if (a > 2 || b > 2) {
      return i;
    }
  }
  return -1;
};

const goThroughRow = (x, m, row) => {
  for (let y = 0; y < m.height; y++) {
    const a = m.topLeft.a + x / m.xZoomConst;
    const b = m.topLeft.b + y / m.yZoomConst;
    const i = mandelbrot({ a, b }, m);
    row[y] = i;
  }
};

self.addEventListener("message", function(evt) {
  let x = evt.data.x;
  let m = evt.data.m;
  let row = [];
  goThroughRow(x, m, row);
  // Tell the main thread to update display
  this.postMessage({ message: "done", row, x });
});
