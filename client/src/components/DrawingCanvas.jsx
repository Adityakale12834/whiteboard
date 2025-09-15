import React, { useEffect, useRef, useState } from "react";

const DrawingCanvas = ({ socket, roomId, color, strokeWidth, tool }) => {
  const canvasRef = useRef();
  const ctxRef = useRef();
  const [drawing, setDrawing] = useState(false);

  const colorRef = useRef(color);
  const widthRef = useRef(strokeWidth);

  // Update refs on prop change
  useEffect(() => {
    colorRef.current = color;
    widthRef.current = strokeWidth;
  }, [color, strokeWidth]);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      // Optional: subtle grid background
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#111"; // dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Drawing events
  const startDrawing = ({ nativeEvent }) => {
    if (!socket?.connected) return;

    const { offsetX, offsetY } = nativeEvent;
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.strokeStyle = tool === "eraser" ? "#111" : colorRef.current;
    ctx.lineWidth = widthRef.current;
    setDrawing(true);

    socket.emit("draw-start", {
      roomId,
      offsetX,
      offsetY,
      color: ctx.strokeStyle,
      strokeWidth: widthRef.current,
    });
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing || !socket?.connected) return;

    const { offsetX, offsetY } = nativeEvent;
    const ctx = ctxRef.current;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    socket.emit("draw-move", { roomId, offsetX, offsetY });
  };

  const endDrawing = () => {
    if (!drawing || !socket?.connected) return;

    ctxRef.current.closePath();
    setDrawing(false);

    socket.emit("draw-end", { roomId });
  };

  // Incoming socket events
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleDrawStart = ({ offsetX, offsetY, color, strokeWidth }) => {
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
    };

    const handleDrawMove = ({ offsetX, offsetY }) => {
      const ctx = ctxRef.current;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    };

    const handleDrawEnd = () => {
      ctxRef.current.closePath();
    };

    const handleClearCanvas = () => {
      const canvas = canvasRef.current;
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on("draw-start", handleDrawStart);
    socket.on("draw-move", handleDrawMove);
    socket.on("draw-end", handleDrawEnd);
    socket.on("clear-canvas", handleClearCanvas);

    return () => {
      socket.off("draw-start", handleDrawStart);
      socket.off("draw-move", handleDrawMove);
      socket.off("draw-end", handleDrawEnd);
      socket.off("clear-canvas", handleClearCanvas);
    };
  }, [socket, roomId]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      className="absolute inset-0 z-0 cursor-crosshair animate-fadeIn"
    />
  );
};

export default DrawingCanvas;
