import saveAs from "file-saver";

export default class Mandelbrot {

  initGrid = () => {
    this.grid = [];
    for (let i = 0; i < this.width; i++) {
      this.grid[i] = [];
    }
  }

  squareC = c => {
    const a = c.a * c.a - c.b * c.b;
    const b = 2 * c.a * c.b;
    return { a, b };
  }

  hexToRgb = hex => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // let this.state.palette = ['644536','B2675E','C4A381','BBD686','EEF1BD'];
  // let this.state.palette = ['34356D','FF5C52','FEE84D','6BAE58','A7DBEA'];
  // let this.state.palette = ['faa916','bd312d','31393c','2176ff','06a77d'];

  makeColorsFromPalette = () => {
    this.colors = [];
    const rgbPalette = this.state.palette.map(color => this.hexToRgb(color));
    for (let i = 0; i < this.state.palette.length; i++) {
      const c1 = rgbPalette[i];
      const c2 = rgbPalette[(i + 1) % this.state.palette.length];
      const diffs = [c2.r - c1.r, c2.g - c1.g, c2.b - c1.b];

      for (let j = 0; j < this.state.colorSmooth; j++) {
        const r = (c1.r += diffs[0] / this.state.colorSmooth);
        const g = (c1.g += diffs[1] / this.state.colorSmooth);
        const b = (c1.b += diffs[2] / this.state.colorSmooth);
        this.colors.push(`rgb(${r},${g},${b})`);
      }
    }
  }

  mandelbrot = c => {
    let z = { a: 0, b: 0 };
    for (let i = 0; i < this.state.iterations; i++) {
      const { a, b } = this.squareC(z);
      z.a = a + c.a;
      z.b = b + c.b;
      if (a > 2 || b > 2) {
        return i;
      }
    }
    return -1;
  }

  checkPoint = point => {
    const a = this.state.topLeft.a + point.x / this.xZoomConst;
    const b = this.state.topLeft.b + point.y / this.yZoomConst;
    const i = this.mandelbrot({ a, b });
    this.grid[point.x][point.y] = i;
    this.ctx.fillStyle = i === -1 ? '#222222' : this.colors[i % this.colors.length];
    this.ctx.fillRect(point.x, point.y, 1, 1);
  }

  recolor = (palette) => {
    this.state.palette = palette;
    this.makeColorsFromPalette();
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const i = this.grid[x][y];
        this.ctx.fillStyle = i === -1 ? '#222222' : this.colors[i % this.colors.length];
        this.ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  calcConsts = (x, y) => {
    this.xZoomConst = (this.width * this.state.zoomConst) / 3;
    this.yZoomConst = this.state.zoomConst / (3 / this.width);

    const centerA = this.state.topLeft.a + (x / this.xZoomConst) * this.state.zoomFactor;
    const centerB = this.state.topLeft.b + (y / this.yZoomConst) * this.state.zoomFactor;
    console.log(`centerA: ${centerA}, centerB: ${centerB}`);

    this.state.topLeft.a = centerA - this.width / 2 / this.xZoomConst;
    this.state.topLeft.b = centerB - this.height / 2 / this.yZoomConst;
    console.log(`Top Left: ${this.state.topLeft.a}, ${this.state.topLeft.b}`);
    // document.getElementById("this.state.topLeft").innerHTML = `Top Left: ${this.state.topLeft.a}, ${this.state.topLeft.b}`;
  }

  goThroughRow = x => {
    for (let y = 0; y < this.height; y++) {
      this.checkPoint({ x, y });
    }
  }

  goThroughPoints = async => {
    for (let x = 0; x < this.width; x++) {
      if (async) {
        setTimeout(() => this.goThroughRow(x), 0);
      } else {
        for (let y = 0; y < this.height; y++) {
          this.checkPoint({ x, y });
        }
      }
    }
  }

  zoom = ({ clientX, clientY }) => {
    this.state.zoomConst *= this.state.zoomFactor;
    this.ctx.clearRect(0, 0, this.width, this.height);
    const x = clientX - this.canvas.getClientRects()[0].left;
    const y = clientY - this.canvas.getClientRects()[0].top;
    this.calcConsts(x, y);
    this.goThroughPoints(true);
  }

  reset = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.start(this.canvas, this.state);
  }

  update = state => {
    this.state = state;
  }

  resize = (width, height) => {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.xZoomConst = (width * this.state.zoomConst) / 3;
    this.yZoomConst = this.state.zoomConst / (3 / width);
    this.initGrid();
    this.goThroughPoints(true);
  }

  save = () => {
    let tempCanvas = this.canvas;
    let tempCtx = this.ctx;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = 6000;
    this.height = 4000;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.xZoomConst = (this.width * this.state.zoomConst) / 3;
    this.yZoomConst = this.state.zoomConst / (3 / this.width);
    this.goThroughPoints();
    this.canvas.toBlob(function(blob) {
      saveAs(
        blob,
        `mandelbrot-${this.state.topLeft.a}-${this.state.topLeft.b}-${
          this.state.zoomConst
        }.png`
      );
    });
    this.canvas = tempCanvas;
    this.ctx = tempCtx;
  }

  start = (canvas, state) => {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.state = state;
    this.width = canvas.width;
    this.height = canvas.height;
    this.initGrid();
    this.makeColorsFromPalette();
    this.xZoomConst = (this.width * this.state.zoomConst) / 3;
    this.yZoomConst = this.state.zoomConst / (3 / this.width);
    this.goThroughPoints(true);
  }
}
