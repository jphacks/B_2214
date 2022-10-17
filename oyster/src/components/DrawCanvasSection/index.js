import Canvas from '@kazuyahirotsu/react-canvas-polygons';
import { createStyles, Button, Container, Grid } from '@mantine/core';
import { setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useTopPageState } from '../../hooks/useTopPageState';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: theme.breakpoints.xl,
    margin: '0',
    padding: `${theme.spacing.xl}px ${theme.spacing.xl}px ${theme.spacing.md}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[0],
    [theme.fn.smallerThan('md')]: {
      padding: `${theme.spacing.md}px ${theme.spacing.sm}px ${theme.spacing.md}px`,
    },
  },
  container: {
    backgroundColor: theme.colors.blue[0],
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.md,
  },
}));

const DrawCanvasSection = (ref) => {
  const { classes } = useStyles();
  const {
    points,
    imageFile,
    imageSize,
    setPoint,
    setPixelArea,
    annotationRef,
    setManual,
  } = useTopPageState();

  const [tool, setTool] = useState('Line');
  const handleCleanCanva = (e) => {
    e?.stopPropagation();
    ref.cleanCanvas();
    setTool('Line');
    const timeout = setTimeout(() => setTool('Polygon'), 50);
    return () => clearTimeout(timeout);
  };

  // need this after change of image
  useEffect(() => {
    imageSize && handleCleanCanva();
  }, [imageSize]);

  // not sure what this is
  useEffect(() => {
    const timeout = setTimeout(() => setTool('Polygon'), 50);
    return () => clearTimeout(timeout);
  }, []);

  // get point data and calculate how many pixels are in the polygon
  const area = require('area-polygon');
  const canvasClick = async (data) => {
    setPoint(data);
    console.log(points);
    if (
      points &&
      Object.keys(points).length > 1 &&
      points[String(Object.keys(points)[1])].length > 2
    ) {
      setPixelArea(area(points[String(Object.keys(points)[1])]));
      console.log(area(points[String(Object.keys(points)[1])]));
      const info = {
        imageSrc: imageFile,
        points: String(points[String(Object.keys(points)[1])]),
      };
      await setDoc(annotationRef, info);
    }
  };

  const onClick = () => {
    setManual(false);
  };

  return (
    <div className={classes.root}>
      {imageSize && (
        <Container className={classes.comtainer}>
          <Grid>
            <Button onClick={onClick}>ai mode</Button>
            <Button disabled>manual mode</Button>
          </Grid>
          <Canvas
            ref={(canvas) => (ref = canvas)}
            imgSrc={imageFile}
            height={imageSize.height}
            width={imageSize.width}
            tool={tool}
            onDataUpdate={(data) => canvasClick(data)}
            onFinishDraw={(data) => {
              // canvasClick(data);
              console.log('finish draw');
            }}
            initialData={points}
          />
          <Button
            size="xl"
            color="orange"
            radius="lg"
            onClick={handleCleanCanva}
          >
            Clean Canvas
          </Button>
        </Container>
      )}
    </div>
  );
};

export default DrawCanvasSection;
