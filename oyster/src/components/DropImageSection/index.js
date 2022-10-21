import { createStyles, Button, Container, Text, Progress, useMantineTheme } from '@mantine/core';
import { IconRefresh } from '@tabler/icons';
import { collection, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Resizer from "react-image-file-resizer";

import { useTopPageState } from '../../hooks/useTopPageState';
import { useMediumSize } from '../../styles/breakpoints';
import { db, storage, STATE_CHANGED } from '../../utils/firebase';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: theme.breakpoints.xl,
    margin: '0',
    padding: `${theme.spacing.xl}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[0],
    [theme.fn.smallerThan('md')]: {
      padding: `${theme.spacing.md}px ${theme.spacing.sm}px  ${theme.spacing.sm}px`,
    },
  },
  buttonContainer: {
    margin: '0',
    padding: `${theme.spacing.xl * 2}px ${theme.spacing.xl}px ${
      theme.spacing.sm
    }px`,
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
    height: '50vh',
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
  const theme = useMantineTheme();
  const isMediumSize = useMediumSize(theme);

  const {
    imageSize,
    setImageFile,
    setImageSize,
    setAnnotationRef,
    setShowResult,
    setControlPanelValue,
    setPredictionImageFile,
    setPredictionImageSize,
    setSmallImageFile,
    setSmallImageSize,
    setLargeImageFile,
    setLargeImageSize,
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
    maxSize: 1000000,
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
    const imgOriginal = new Image();
    imgOriginal.src = URL.createObjectURL(file);
    imgOriginal.onload = () => {

      if(parseInt(imgOriginal.width)<250){
        setSmallImageFile(imgOriginal.src);
        setSmallImageSize({
          height: imgOriginal.height,
          width: imgOriginal.width,
        })
        setLargeImageFile(imgOriginal.src);
        setLargeImageSize({
          height: imgOriginal.height,
          width: imgOriginal.width,
        })
        setImageFile(imgOriginal.src);
        setImageSize({
          height: imgOriginal.height,
          width: imgOriginal.width,
        })
      }else if(parseInt(imgOriginal.width)>=250&&parseInt(imgOriginal.width)<=750){
        Resizer.imageFileResizer(
          file,
          250,
          500,
          "JPEG",
          100,
          0,
          (uri) => {
            setSmallImageFile(uri);
            const smallImg = new Image();
            smallImg.src = uri;
            smallImg.onload = () => {
              setSmallImageSize({
                height: smallImg.height,
                width: smallImg.width,
              })
              if(isMediumSize){
                setImageFile(uri);
                setImageSize({
                  height: smallImg.height,
                  width: smallImg.width,
                })
              }
            };
          },
          "base64",
        );
        setLargeImageFile(imgOriginal.src);
        setLargeImageSize({
          height: imgOriginal.height,
          width: imgOriginal.width,
        })
        if(!isMediumSize){
          setImageFile(imgOriginal.src);
          setImageSize({
            height: imgOriginal.height,
            width: imgOriginal.width,
          })
        }
      }else{
        Resizer.imageFileResizer(
          file,
          250,
          500,
          "JPEG",
          100,
          0,
          (uri) => {
            setSmallImageFile(uri);
            const smallImg = new Image();
            smallImg.src = uri;
            smallImg.onload = () => {
              setSmallImageSize({
                height: smallImg.height,
                width: smallImg.width,
              })
              if(isMediumSize){
                setImageFile(uri);
                setImageSize({
                  height: smallImg.height,
                  width: smallImg.width,
                })
              }
            };
          },
          "base64",
          0,
          0,
        );
        Resizer.imageFileResizer(
          file,
          750,
          1000,
          "JPEG",
          100,
          0,
          (uri) => {
            setLargeImageFile(uri);
            const largeImg = new Image();
            largeImg.src = uri;
            largeImg.onload = () => {
              setLargeImageSize({
                height: largeImg.height,
                width: largeImg.width,
              })
              if(!isMediumSize){
                setImageFile(uri);
                setImageSize({
                  height: largeImg.height,
                  width: largeImg.width,
                })
              }
            };
          },
          "base64",
          0,
          0,
        );

      }
    }


    // Get the file
    // const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const fileRef = ref(storage, `images/${generateString(20)}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(fileRef, file);  // we should be using resized file if the image is too big, but not implimented yet

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
        const imgUpload = new Image();
        imgUpload.src = url;
        imgUpload.onload = () => {
          setPredictionImageSize({
            height: imgUpload.height,
            width: imgUpload.width,
          });
        };
        setPredictionImageFile(url);
        setAnnotationRef(doc(collection(db, 'annotation')));
        setControlPanelValue('ai');
        setShowResult(false);
      });

  };

  return (
    <div className={imageSize ? classes.buttonContainer : classes.root}>
      <div {...getRootProps()}>
        {imageSize ? (
          <div className={classes.button}>
            <Button
              size="xl"
              color="blue"
              radius="lg"
              rightIcon={<IconRefresh />}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <Container className={classes.container}>
            {uploading ? (
              <Progress value={progress} color="blue" />
            ) : isDragActive ? (
              <Text>Drop the image here ...</Text>
            ) : (
              <Text>
                Drag and drop the image here <br /> or <br /> click to select
                the image{' '}<br />(jpeg, ~1MB)
              </Text>
            )}
          </Container>
        )}
      </div>
    </div>
  );
};

export default DropImageSection;
