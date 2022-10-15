import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useTopPageState } from '../../hooks/useTopPageState';
import { storage, STATE_CHANGED } from '../../utils/firebase';


const DropImageSection = () => {
  const { imageSize, setImageFile, setImageSize } = useTopPageState();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      uploadFile(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    onDrop,
  });



  // Uploads images to Firebase Storage
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Creates a Firebase Upload Task
  const uploadFile = async (file) => {
    // Get the file
    // const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const fileRef = ref(storage, `uploads/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(fileRef, file)

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(pct);
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => getDownloadURL(fileRef))
      .then((url) => {
        setUploading(false);
        const img = new Image();
        console.log(url);
        setImageFile(url);
        img.src = url;
        img.onload = () => {
          setImageSize({
            height: img.height,
            width: img.width,
          });
          console.log(img.height);
          console.log(img.width);
        };
      });
  };

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
            <p>Drag and drop the image here, or click to select the image</p>
          )}
        </div>
      )}
      {uploading && <p>{progress}% uploading...</p>}
    </div>
  );
};

export default DropImageSection;
