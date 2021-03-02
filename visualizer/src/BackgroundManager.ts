export class BackgroundManager {
  private backgroundWidth = 500;
  private backgroundHeight = 500;

  mounted() {
    window.addEventListener("resize", this.onResize.bind(this));
    this.performBackgroundUpdate();
  }

  private performBackgroundUpdate() {
    this.updateSize();
    this.drawBackground();
  }

  private updateSize() {
    const mainCanvas = document.getElementsByTagName('body')[0];
    console.log(mainCanvas);
    
    if (mainCanvas) {
      const boundingRect = mainCanvas.getBoundingClientRect();
      this.backgroundHeight = boundingRect.height;
      this.backgroundWidth = boundingRect.width;
    }
  }

  private drawBackground() {
    const backgroundCanvas = document.getElementById(
      "backgroundImage"
    ) as HTMLCanvasElement;
    const ctx = backgroundCanvas.getContext("2d");
    if (!ctx) return;
    const w = this.backgroundWidth;
    const h = this.backgroundHeight;
    backgroundCanvas.width = w;
    backgroundCanvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.85);
    ctx.quadraticCurveTo(w / 1.85, h, w, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = "#282f35";
    ctx.strokeStyle = "#282F35";
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize.bind(this));
  }

  onResize() {
    this.performBackgroundUpdate();
  }
}