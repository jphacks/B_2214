import Canvas from '@kazuyahirotsu/react-canvas-polygons';
import {
  createStyles,
  Button,
  Container,
  SegmentedControl,
  Stepper,
  useMantineTheme,
} from '@mantine/core';
import { IconEraser } from '@tabler/icons';
import { setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useTopPageState } from '../../hooks/useTopPageState';
import { useMediumSize } from '../../styles/breakpoints';

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
  stepContainer: {
    margin: '0',
    padding: `${theme.spacing.md}px`,
  },
  step: {
    minHeight: '0px',
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
    [theme.fn.smallerThan('md')]: {
      padding: `${theme.spacing.xs}px ${theme.spacing.xs}px ${theme.spacing.xs}px`,
    },
  },
}));

const DrawCanvasSection = (ref) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMediumSize = useMediumSize(theme);
  const {
    points,
    imageFile,
    imageSize,
    setPoint,
    setPixelArea,
    annotationRef,
    setManual,
    controlPanelValue,
    setControlPanelValue,
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
    if (
      points &&
      Object.keys(points).length > 1 &&
      points[String(Object.keys(points)[1])].length > 2
    ) {
      setPixelArea(area(points[String(Object.keys(points)[1])]));
      const info = {
        imageSrc: imageFile,
        points: String(points[String(Object.keys(points)[1])]),
      };
      await setDoc(annotationRef, info);
      console.log("manual pixel area set")
    }
  };

  useEffect(() => {
    if (controlPanelValue === 'manual') setManual(true);
    else setManual(false);
  }, [controlPanelValue]);

  return (
    <div className={classes.root}>
      <div className={classes.stepContainer}>
        <Stepper
          orientation={isMediumSize ? 'vertical' : 'horizontal'}
          size="md"
          // size={isMediumSize ? 'xs' : 'md'}
          active={1}
          color="blue"
        >
          <Stepper.Step label="Step 1" description="Upload Image"  className={classes.step}/>
          <Stepper.Step
            label="Step 2"
            description="Surround Image and Input Area"
            className={classes.step}
          />
          <Stepper.Step label="Step 3" description="Click Two Points"  className={classes.step}/>
        </Stepper>
      </div>
      {imageSize && (
        <Container className={classes.container}>
          <SegmentedControl
            color="blue"
            value={controlPanelValue}
            onChange={setControlPanelValue}
            data={[
              { label: 'AI mode', value: 'ai' },
              { label: 'Manual mode', value: 'manual' },
            ]}
          />

          <Canvas
            ref={(canvas) => (ref = canvas)}
            imgSrc={imageFile}
            height={imageSize.height}
            width={imageSize.width}
            tool={tool}
            onDataUpdate={(data) => canvasClick(data)}
            onFinishDraw={(data) => {
              canvasClick(data);
              console.log('finish draw');
            }}
            initialData={points}
          />
          <Button
            size="xl"
            color="blue"
            radius="lg"
            onClick={handleCleanCanva}
            rightIcon={<IconEraser />}
          >
            Clean Canvas
          </Button>
        </Container>
      )}
    </div>
  );
};

export default DrawCanvasSection;
