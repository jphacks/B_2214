import Canvas from '@kazuyahirotsu/react-canvas-polygons';
import { Button, createStyles, Container, Title } from '@mantine/core';
import { IconEraser } from '@tabler/icons';
import { useEffect, useState } from 'react';

import { useTopPageState } from '../../hooks/useTopPageState';

const useStyles = createStyles((theme) => ({
  root: {
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
  button: {
    gap: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
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

const Result = (ref) => {
  const { classes } = useStyles();
  const { imageFile, imageSize, scale } = useTopPageState();
  const [tool, setTool] = useState('Polygon');
  const [lineLength, setLineLength] = useState();

  const handleCleanCanva = (e) => {
    e?.stopPropagation();
    ref.cleanCanvas();
    setTool('Polygon');
    const timeout = setTimeout(() => setTool('Line'), 50);
    return () => clearTimeout(timeout);
  };

  // need this after change of image
  useEffect(() => {
    imageSize && handleCleanCanva();
  }, [imageSize]);

  // not sure what this is
  useEffect(() => {
    const timeout = setTimeout(() => setTool('Line'), 50);
    return () => clearTimeout(timeout);
  }, []);

  // get point data and calculate how many pixels are in the polygon
  const canvasClick = async (data) => {
    if (data.Line[0]) {
      const tmp =
        scale *
        Math.sqrt(
          Math.pow(data.Line[0][0][0] - data.Line[0][1][0], 2) +
            Math.pow(data.Line[0][0][1] - data.Line[0][1][1], 2),
        );
      setLineLength(Number.parseFloat(tmp).toFixed(2));
    }
  };

  return (
    <div className={classes.root}>
      {imageSize && (
        <Container className={classes.container}>
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
          {lineLength ? <Title>{lineLength}m</Title> : <Title> </Title>}
        </Container>
      )}
    </div>
  );
};

export default Result;
