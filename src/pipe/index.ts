type Point = {
  x: number;
  y: number;
  stepX: number;
  stepY: number;
  time: number;
  radius: number;
  color: string;
};
class CanvasPipe {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  animate: number = 0;
  num: number = 10;
  timeLife: number = 5;
  time: number = 120;
  points: Point[] = [];
  constructor(op: {
    el: HTMLCanvasElement;
    width: number;
    height: number;
    num: number;
    timeLife: number;
    lineWidth: number;
  }) {
    this.canvas = op.el;
    this.canvas.width = op.width;
    this.canvas.height = op.height;
    this.ctx = op.el.getContext('2d')!;
    this.num = op.num;
    this.timeLife = op.timeLife;
    const points: Point[] = [];
    const unitX = Math.floor(op.width * 0.1);
    const unitY = Math.floor(op.width * 0.1);
    for (let i = 0; i < this.num; i++) {
      points.push({
        x: Math.floor(Math.random() * 10) * unitX,
        y: Math.floor(Math.random() * 10) * unitY,
        stepX: Math.pow(-1, Math.floor(Math.random() * 10)),
        stepY: Math.pow(-1, Math.floor(Math.random() * 10)),
        color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)})`,
        radius: op.lineWidth,
        time: op.timeLife
      });
      this.points = points;
    }
  }
  draw() {
    const ctx = this.ctx;
    if (this.time === 0) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.time = 120;
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.1;
    this.points.forEach((p) => {
      this.movePoint(p);
    });
    this.time--;
    this.animate = requestAnimationFrame(this.draw.bind(this));
  }
  movePoint(p: Point) {
    if (
      p.time < 0 ||
      !(p.x >= 0 && p.x <= this.canvas.width && p.y >= 0 && p.y <= this.canvas.height)
    ) {
      p.time = this.timeLife;
      p.stepX = Math.pow(-1, Math.floor(Math.random() * 99));
      p.stepY = Math.pow(-1, Math.floor(Math.random() * 99));
    }
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.color;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    p.x += p.stepX;
    p.y += p.stepY;
    p.time--;
  }
  destory() {
    this.points = [];
    cancelAnimationFrame(this.animate);
  }
}

const c = new CanvasPipe({
  el: document.getElementById('myCanvas') as HTMLCanvasElement,
  width: 800,
  height: 800,
  num: 10,
  timeLife: 30,
  lineWidth: 5
});
c.draw();
