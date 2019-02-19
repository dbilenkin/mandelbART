import { Decimal } from "decimal.js";

export default class MandelbrotDecimal {
  squareCDecimal = c => {
    const a = c.a.times(c.a).minus(c.b.times(c.b));
    const b = new Decimal(2).times(c.a).times(c.b);
    return { a, b };
  };

  mandelbrotDecimal = c => {
    let z = { a: new Decimal(0), b: new Decimal(0) };
    for (let i = 0; i < Math.pow(2, this.state.iterations); i++) {
      const { a, b } = this.squareCDecimal(z);
      z.a = a.plus(c.a);
      z.b = b.plus(c.b);
      if (a.comparedTo(2) === 1 || b.comparedTo(2) === 1) {
        return i;
      }
    }
    return -1;
  };

  checkPoint = point => {
    // const a = this.state.topLeft.a + point.x / this.xZoomConst;
    // const b = this.state.topLeft.b + point.y / this.yZoomConst;

    const a = this.state.topLeft.a.plus(point.x).dividedBy(this.xZoomConst);
    const b = this.state.topLeft.b.plus(point.y).dividedBy(this.yZoomConst);

    // const i = this.mandelbrot({ a, b });
    const i = this.mandelbrotDecimal({ a, b });

    this.grid[point.x][point.y] = i;
    this.ctx.fillStyle =
      i === -1 ? "#000000" : this.colors[i % this.colors.length];
    this.ctx.fillRect(point.x, point.y, 1, 1);
  };

  calcConsts = (x, y) => {
    this.xZoomConst = (this.width * this.state.zoomConst) / 3;
    this.yZoomConst = this.state.zoomConst / (3 / this.width);

    // const centerA =
    //   this.state.topLeft.a + (x / this.xZoomConst) * this.state.zoomFactor;
    // const centerB =
    //   this.state.topLeft.b + (y / this.yZoomConst) * this.state.zoomFactor;

    const centerA = this.state.topLeft.a
      .plus(x)
      .dividedBy(this.xZoomConst)
      .times(this.state.zoomFactor);
    const centerB = this.state.topLeft.b
      .plus(y)
      .dividedBy(this.yZoomConst)
      .times(this.state.zoomFactor);

    console.log(`centerA: ${centerA}, centerB: ${centerB}`);

    // this.state.topLeft.a = centerA - this.width / 2 / this.xZoomConst;
    // this.state.topLeft.b = centerB - this.height / 2 / this.yZoomConst;

    this.state.topLeft.a = centerA
      .minus(this.width)
      .dividedBy(2)
      .dividedBy(this.xZoomConst);
    this.state.topLeft.b = centerB
      .minus(this.height)
      .dividedBy(2)
      .dividedBy(this.yZoomConst);

    console.log(`Top Left: ${this.state.topLeft.a}, ${this.state.topLeft.b}`);
    // document.getElementById("this.state.topLeft").innerHTML = `Top Left: ${this.state.topLeft.a}, ${this.state.topLeft.b}`;
  };
}
