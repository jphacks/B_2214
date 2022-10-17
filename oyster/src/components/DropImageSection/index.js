import { createStyles, Button, Container, Text } from '@mantine/core';
import { collection, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useTopPageState } from '../../hooks/useTopPageState';
import { db, storage, STATE_CHANGED } from '../../utils/firebase';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: theme.breakpoints.xl,
    margin: '0',
    padding: `${theme.spacing.xl}px ${theme.spacing.xl}px ${theme.spacing.sm}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[0],
    [theme.fn.smallerThan('md')]: {
      padding: `${theme.spacing.md}px ${theme.spacing.sm}px  ${theme.spacing.sm}px`,
    },
  },
  button: {
    gap: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
  },
  container: {
    height: '30vh',
    width: '50vw',
    backgroundColor: theme.colors.blue[0],
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: theme.radius.md,
    color: theme.colors.blue[6],
    fontWeight: '700',
    fontSize: theme.fontSizes.xl,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.blue[1],
    },
    [theme.fn.smallerThan('md')]: {
      padding: theme.spacing.sm,
      width: '80vw',
    },
  },
}));

const DropImageSection = () => {
  const { classes } = useStyles();

  const {
    imageSize,
    setImageFile,
    setImageSize,
    setAnnotationRef,
    setShowResult,
    setManual,
  } = useTopPageState();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      uploadFile(file);
    });
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      // 'image/png': [],
    },
    onDrop,
  });

  // random string generator
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  // Uploads images to Firebase Storage
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Creates a Firebase Upload Task
  const uploadFile = async (file) => {
    // Get the file
    // const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const fileRef = ref(storage, `images/${generateString(20)}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(fileRef, file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
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
        setAnnotationRef(doc(collection(db, 'annotation')));
        setManual(false);
        setShowResult(false);
      });
  };

  return (
    <div className={classes.root}>
      <div {...getRootProps()}>
        {imageSize ? (
          <div className={classes.button}>
            <Button size="xl" color="blue" radius="lg">
              Change Image
            </Button>
          </div>
        ) : (
          <Container className={classes.container}>
            {isDragActive ? (
              <Text>Drop the image here ...</Text>
            ) : (
              <Text>
                Drag and drop the image here <br /> or <br /> click to select
                the image{' '}
              </Text>
            )}
          </Container>
        )}
      </div>
      {uploading && <p>{progress}% uploading...</p>}
    </div>
  );
};

export default DropImageSection;
