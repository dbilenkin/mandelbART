const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const topLeft = {
  a: -2,
  b: -1
}

let zoomConst = 1;
let xZoomConst = width*zoomConst/3;
let yZoomConst = height*zoomConst/2;
let eyes = {};

const squareC = (c) => {
  const a = c.a*c.a - c.b*c.b
  const b = 2*c.a*c.b;
  return {a,b}
}

const colors = [];
const m = 180;
const zoomFactor = 10;

hexToRgb = (hex) => {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return {r,g,b};
}

rgbTorgbString = (rgb) => {
  return 
}

// let palette = ['644536','B2675E','C4A381','BBD686','EEF1BD'];
// let palette = ['34356D','FF5C52','FEE84D','6BAE58','A7DBEA'];
// let palette = ['faa916','bd312d','31393c','2176ff','06a77d'];
let palette = ['264653','2a9d8f','e9c46a','f4a261','e76f51'];
const range = 500;

const makeColorsFromPalette = () => {
  const rgbPalette = palette.map(color => hexToRgb(color));
  for (let i = 0; i < palette.length; i++) {
    c1 = rgbPalette[i];
    c2 = rgbPalette[(i+1)%palette.length];
    diffs = [c2.r - c1.r,c2.g - c1.g,c2.b - c1.b];
    const maXdiff = Math.max(...diffs);

    for (let j = 0; j < range; j++) {
      const r = c1.r += (diffs[0]/range);
      const g = c1.g += (diffs[1]/range);
      const b = c1.b += (diffs[2]/range);
      colors.push(`rgb(${r},${g},${b})`);
    }
  }
}

const makeColors = () => {
  for (let i = 0; i < (m * 6); i++) {
    let r = m, g = 0, b = 0;
    if (i < m) {
      g = i;
    } else if (i < 2*m) {
      r = 2*m - i;
      g = m;
    } else if (i < 3*m) {
      r = 0;
      g = m;
      b = i - 2*m;
    } else if (i < 4*m) {
      r = 0;
      g = 4*m - i;
      b = m;
    } else if (i < 5*m) {
      r = i - 4*m;
      b = m;
    } else {
      r = m;
      g = 0;
      b = 6*m - i;
    }
    colors.push(`rgb(${r},${g},${b})`);
  }
}

const mandelbrot = (c) => {
  let z = {a: 0, b: 0};
  // let zs = {};
  for (i = 0; i < 10000; i++) {
    const {a,b} = squareC(z);
    z.a = a + c.a;
    z.b = b + c.b;
    if (a > 2 || b > 2) {
      // if (eyes[i]) {
      //   eyes[i]++;
      // } else {
      //   eyes[i] = 1;
      // }
      return colors[i%colors.length];
    }
    // zs[z.a] = true;
  }
  return "#222222";
}

const checkPoint = (point) => {
  const a = topLeft.a + point.x / xZoomConst;
  const b = topLeft.b + point.y / yZoomConst;
  ctx.fillStyle = mandelbrot({a,b});
  ctx.fillRect(point.x, point.y, 1, 1);  
}

const calcConsts = (x,y) => {
  xZoomConst = width*zoomConst/3;
  yZoomConst = height*zoomConst/2;

  const centerA = topLeft.a + x / xZoomConst * zoomFactor;
  const centerB = topLeft.b + y / yZoomConst * zoomFactor;
  console.log(`centerA: ${centerA}, centerB: ${centerB}`);

  topLeft.a = centerA - width/2 / xZoomConst;
  topLeft.b = centerB - height/2 / yZoomConst;
  console.log(`Top Left: ${topLeft.a}, ${topLeft.b}`);
  // document.getElementById("topLeft").innerHTML = `Top Left: ${topLeft.a}, ${topLeft.b}`;
  
}


const goThroughPoints = () => {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      checkPoint({x,y});
    }
  }
  console.log(`eyes: ${JSON.stringify(eyes)}`);
}


const zoom = ({clientX, clientY}) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  zoomConst*=zoomFactor;
  calcConsts(clientX, clientY);
  goThroughPoints();
}

canvas.addEventListener("click", zoom);

makeColorsFromPalette();
goThroughPoints();


