import { useEffect, useState } from "react";
import Canvas from "react-canvas-polygons";

const DrawCanvas = ({ initialData, onChange }: any, ref: any) => {
  const [tool, setTool] = useState("Line");
  const handleCleanCanva = (e: any) => {
    e.stopPropagation();
    ref.cleanCanvas();
    setTool("Line");
    const timeout = setTimeout(() => setTool("Polygon"), 50);
    return () => clearTimeout(timeout);
  };
  useEffect(() => {
    const timeout = setTimeout(() => setTool("Polygon"), 50);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div>
      <button
        // variant="outlined"
        style={{ marginBottom: "20px" }}
        onClick={handleCleanCanva}
      >
        Clean Canvas
      </button>
      <Canvas
        ref={(canvas: any) => (ref = canvas)}
        imgSrc="https://images.globalindustrial.com/images/enlarge/695511.jpg?t=1628284125430"
        height={800}
        width={800}
        tool={tool}
        onDataUpdate={(data: any) => onChange(data)}
        onFinishDraw={() => console.log("finish draw")}
        initialData={initialData}
      />
    </div>
  );
};

export default DrawCanvas;
