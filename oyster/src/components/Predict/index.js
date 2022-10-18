import {
  createStyles,
  Container,
  SegmentedControl,
  Loader,
  Text,
  Button,
} from '@mantine/core';
import { IconEraser } from '@tabler/icons';
import { useEffect } from 'react';

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

const Predict = ({ imageUrl }) => {
  const { classes } = useStyles();
  const {
    manual,
    setManual,
    controlPanelValue,
    setControlPanelValue,
    predictionRequestUrl,
    setPredictionRequestUrl,
    prediction,
    setPrediction,
    setPixelArea,
  } = useTopPageState();

  useEffect(() => {
    if (predictionRequestUrl !== imageUrl) {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instances: [{ image: imageUrl }] }),
      };
      console.log(requestOptions);
      fetch(
        'https://asia-northeast1-oyster-365512.cloudfunctions.net/madori-endpoint-api',
        requestOptions,
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setPrediction(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      setPredictionRequestUrl(imageUrl);
    }
  }, [imageUrl]);

  setPixelArea(prediction?.prediction[0].area);
  console.log(prediction?.prediction[0].area);

  useEffect(() => {
    if (controlPanelValue === 'manual') setManual(true);
    else setManual(false);
    console.log(controlPanelValue, manual);
  }, [controlPanelValue]);

  return (
    <div className={classes.root}>
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
        <>
          {prediction ? (
            <>
              <img src={prediction?.prediction[0].url} />
              <Button
                size="xl"
                color="blue"
                radius="lg"
                disabled
                rightIcon={<IconEraser />}
              >
                Clean Canvas
              </Button>
            </>
          ) : (
            <>
              <Text>fetching ai prediction...</Text>
              <Loader />
            </>
          )}
        </>
      </Container>
    </div>
  );
};

export default Predict;
