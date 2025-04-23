export const helloCanvas = (canvasId: string) => {
 const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
 const ctx = canvas.getContext('2d');

 if (!ctx) return;

 ctx.fillStyle = 'lime';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
};
