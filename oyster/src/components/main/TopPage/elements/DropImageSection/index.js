import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { useTopPageState } from '../../hoooks/useTopPageState';

const DropImageSection = () => {
  const { imageSize, setImageFile, setImageSize } = useTopPageState();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const img = new Image();
      console.log(URL.createObjectURL(file));
      setImageFile(URL.createObjectURL(file));
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImageSize({
          height: img.height,
          width: img.width,
        });
        console.log(img.height);
        console.log(img.width);
      };
    });
  }, []);

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
    </div>
  );
};

export default DropImageSection;
