import { useDropzone } from 'react-dropzone';

import { useTopPageState } from '../../hoooks/useTopPageState';

const DropImageSection = () => {
  const {
    pixelArea,
    inputArea,
    setInputArea,
    scale,
    imageSize,
    options,
    selectedMetric,
    handleChange,
    onClickCalc,
    onDrop,
  } = useTopPageState();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    onDrop,
  });

  return (
    <div>
      {imageSize ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <button>click to change image</button>
        </div>
      ) : (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here ...</p>
          ) : (
            <p>Drag &aposn drop the image here, or click to select the image</p>
          )}
        </div>
      )}

      <p>total pixels in the polygon is {pixelArea} pixels</p>

      <input
        type="number"
        value={inputArea}
        onChange={(event) => setInputArea(event.target.value)}
      />
      <select value={selectedMetric} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
      <button onClick={onClickCalc}>calc</button>

      <p>
        scale is {scale} {selectedMetric} / pixel
      </p>
    </div>
  );
};

export default DropImageSection;
