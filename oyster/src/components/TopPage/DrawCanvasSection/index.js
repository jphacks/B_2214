import { useEffect, useState } from "react";
import Canvas from "react-canvas-polygons";

const DrawCanvasSection = ({imageFile, imageSize, initialData, onChange }, ref) => {
  const [tool, setTool] = useState("Line");
  const handleCleanCanva = (e) => {
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
        variant="outlined"
        style={{ marginBottom: "20px" }}
        onClick={handleCleanCanva}
      >
        Clean Canvas
      </button>
      <Canvas
        ref={(canvas) => (ref = canvas)}
        imgSrc={imageFile}
        height={imageSize.height}
        width={imageSize.width}
        tool={tool}
        onDataUpdate={(data) => onChange(data)}
        onFinishDraw={(data) => {
          onChange(data);
          console.log("finish draw");}}
        // onFinishDraw={() => console.log("finish draw")}
        initialData={initialData}
      />
    </div>
  );
};

export default DrawCanvasSection;