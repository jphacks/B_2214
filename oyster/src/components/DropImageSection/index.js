import { createStyles, Button, Box, Text } from '@mantine/core';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { useTopPageState } from '../../hooks/useTopPageState';
// import { useMediumSize } from '../../styles/breakpopints';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: theme.breakpoints.xl,
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: ' space-between',
    alignItems: 'center',
    color: theme.black,
  },
  box: {
    backgroundColor: theme.colors.gray[2],
    padding: theme.spacing.xl,
    textAlign: 'center',
    borderRadius: theme.radius.md,
    color: theme.colors.blue[6],
    fontWeight: '700',
    fontSize: theme.fontSizes.xl,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.gray[4],
    },
  },
}));

const DropImageSection = () => {
  const { classes } = useStyles();
  // const theme = useMantineTheme();
  // const isMediumSize = useMediumSize(theme);

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
    <div className={classes.root}>
      <div {...getRootProps()}>
        {imageSize ? (
          <>
            <Box className={classes.box} {...getInputProps()} />
            <Button>click to change image</Button>
          </>
        ) : (
          <Box className={classes.box}>
            {isDragActive ? (
              <Text>Drop the image here ...</Text>
            ) : (
              <Text>
                Drag and drop the image here <br />
                or
                <br /> click to select the image
              </Text>
            )}
          </Box>
        )}
      </div>
    </div>
  );
};

export default DropImageSection;
