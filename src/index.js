class Transform {
  constructor(
    {
      translate = [0, 0],
      scale = [1, 1],
      skew = [0, 0],
      rotation = 0,
      pivot = [0, 0],
    }
  ) {
    const cx = Math.cos(rotation + skew[1]);
    const sx = Math.sin(rotation + skew[1]);
    const cy = -Math.sin(rotation - skew[0]);
    const sy = Math.cos(rotation - skew[0]);

    this.a = cx * scale[0];
    this.b = sx * scale[0];
    this.c = cy * scale[1];
    this.d = sy * scale[1];

    this.tx = translate[0] - (pivot[0] * this.a + pivot[1] * this.c);
    this.ty = translate[1] - (pivot[0] * this.b + pivot[1] * this.d);
  }

  apply([x, y]) {
    const {
      a, c, tx,
      b, d, ty,
    } = this;

    return [
      x * a + y * c + tx,
      x * b + y * d + ty,
    ];
  }
}

const app = document.getElementById('app');
const width = app.width = 600;
const height = app.height = 600;

const ctx = app.getContext('2d');

const drawPath = (path, close = true) => {
  ctx.beginPath();

  for (const [idx, [x, y]] of path.entries()) {
    x = x + width / 2;
    y = -y + height / 2;

    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  if (close) {
    ctx.closePath();
  }

  ctx.stroke();
};

ctx.strokeStyle = '#ddd';
drawPath([[-width / 2, 0], [width / 2, 0]]);
drawPath([[0, -height / 2], [0, height / 2]]);

const original = [[0, 0]];
const path = [[0, 0]];
const r = 100;
const transform = new Transform({
  skew: [30 / 180 * Math.PI, 0],
  rotation: 60 / 180 * Math.PI,
});
console.log(transform);
global.t = transform;

for (let i = 0; i <= 360; i += 360 / 16) {
  const t = i / 180 * Math.PI;
  const point = [r * Math.cos(t), r * Math.sin(t)];
  original.push(point);
  path.push(transform.apply(point));
}

ctx.strokeStyle = '#666';
drawPath(original);

ctx.strokeStyle = '#222';
drawPath(path);
