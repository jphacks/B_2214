import {
  createStyles,
  Container,
  SegmentedControl,
  Loader,
  Text,
  Button,
  useMantineTheme,
} from '@mantine/core';
import { IconEraser } from '@tabler/icons';
import { useEffect } from 'react';

import { useTopPageState } from '../../hooks/useTopPageState';
import { useMediumSize } from '../../styles/breakpoints';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 1920,
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
    stepContainer: {
      margin: '0',
      padding: `${theme.spacing.md}px`,
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

const Predict = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMediumSize = useMediumSize(theme);
  const {
    predictionImageFile: imageUrl,
    setManual,
    controlPanelValue,
    setControlPanelValue,
    predictionRequestUrl,
    setPredictionRequestUrl,
    prediction,
    setPrediction,
    setPixelArea,
    imageSize,
    smallImageSize,
    largeImageSize,
    predictionImageSize,
    setModel,
  } = useTopPageState();

  useEffect(() => {
    if (predictionRequestUrl !== imageUrl) {
      setPrediction();
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
        // fetch(
        //   'http://localhost:8080/predict',
        //   requestOptions,
        // )
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setPrediction(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      setPredictionRequestUrl(imageUrl);

      setModel();
      fetch(
        'https://asia-northeast1-oyster-365512.cloudfunctions.net/madori-3d-endpoint-api',
        requestOptions,
      )
        // fetch(
        //   'http://localhost:8080/predict2',
        //   requestOptions,
        // )
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setModel(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [imageUrl]);

  useEffect(() => {
    if (controlPanelValue === 'manual') setManual(true);
    else setManual(false);
  }, [controlPanelValue]);

  useEffect(() => {
    if (isMediumSize) {
      setPixelArea(
        prediction?.prediction[0].area *
          ((smallImageSize.width * smallImageSize.height) /
            (predictionImageSize.width * predictionImageSize.height)),
      );
    } else {
      setPixelArea(
        prediction?.prediction[0].area *
          ((largeImageSize.width * largeImageSize.height) /
            (predictionImageSize.width * predictionImageSize.height)),
      );
    }
    console.log('prediction pixel area set');
  }, [isMediumSize, prediction]);

  // if you use prediction to calc and change window size in result mode, it will not be correct

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
              <img
                src={prediction?.prediction[0].url}
                width={imageSize.width}
                height={imageSize.height}
              />
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
              <Text>fetching AI prediction...</Text>
              <Loader />
            </>
          )}
        </>
      </Container>
    </div>
  );
};

export default Predict;
