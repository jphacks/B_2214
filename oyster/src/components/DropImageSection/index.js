import { createStyles, Button, Container, Text } from '@mantine/core';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { useTopPageState } from '../../hooks/useTopPageState';

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

  const { getRootProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    onDrop,
  });

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
    </div>
  );
};

export default DropImageSection;
