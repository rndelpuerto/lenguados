export const helloCanvas = (canvasId: string) => {
 const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
 const context = canvas.getContext('2d');

 if (!context) return;

 context.fillStyle = 'lime';
 context.fillRect(0, 0, canvas.width, canvas.height);
};
