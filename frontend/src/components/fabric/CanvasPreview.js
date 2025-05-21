import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const CanvasPreview = ({ rows, backgroundUrl }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 200,
      height: 200,
      selection: false,
    });
    fabricCanvasRef.current = canvas;

    fabric.Image.fromURL(backgroundUrl, (img) => {
      img.scaleToWidth(canvas.getWidth());
      img.scaleToHeight(canvas.getHeight());
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });

    return () => {
      canvas.dispose();
    };
  }, [backgroundUrl]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Clear existing text (except background)
    canvas.getObjects().forEach(obj => {
      if (obj !== canvas.backgroundImage) canvas.remove(obj);
    });

    rows.forEach((row, i) => {
      const topOffset = 50 + i * 80;

      if (row.name) {
        const nameText = new fabric.Text(row.name, {
          left: 80,
          top: topOffset,
          fontSize: 20,
          fill: '#000',
          fontFamily: 'Arial',
        });
        canvas.add(nameText);
      }

      if (row.number) {
        const numberText = new fabric.Text(row.number, {
          left: 80,
          top: topOffset + 25,
          fontSize: 18,
          fill: '#333',
          fontFamily: 'Arial',
        });
        canvas.add(numberText);
      }
    });

    canvas.renderAll();
  }, [rows]);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: '1px solid #ddd', borderRadius: 4, background: '#fff' }}
    />
  );
};



export default CanvasPreview;