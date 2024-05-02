export function fill(canvas: HTMLCanvasElement, color: string) {
  const ctx = canvas.getContext('2d')!;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawImage(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const imgAR = image.width / image.height;
  const canvasAR = canvas.width / canvas.height;
  const ctx = canvas.getContext('2d')!;
  if (imgAR < canvasAR) {
    ctx.drawImage(image, (canvas.width - canvas.height * imgAR) / 2, 0, canvas.height * imgAR, canvas.height);
  } else {
    ctx.drawImage(image, 0, (canvas.height - canvas.width / imgAR) / 2, canvas.width, canvas.width / imgAR);
  }
}

export function drawAndFill(canvas: HTMLCanvasElement, image: HTMLImageElement, color?: string) {
  if (color) {
    fill(canvas, color);
  }
  drawImage(canvas, image);
};
