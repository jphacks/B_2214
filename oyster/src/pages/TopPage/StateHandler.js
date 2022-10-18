import { Grid, createStyles, Container, useMantineTheme } from '@mantine/core';

import CalculateSection from '../../components/CalculateSection';
import DrawCanvasSection from '../../components/DrawCanvasSection';
import DropImageSection from '../../components/DropImageSection';
import Predict from '../../components/Predict';
import Result from '../../components/Result';
import { useTopPageState } from '../../hooks/useTopPageState';
import { useMediumSize } from '../../styles/breakpoints';

const useStyles = createStyles((theme) => ({
  root: {
    margin: '0',
    padding: `0`,
    backgroundColor: theme.colors.gray[0],
  },
  gridCol: {
    margin: '0',
    padding: `0`,
    backgroundColor: theme.colors.gray[0],
  },
  container: {
    padding: `0px`,
    gap: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const StateHandler = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMediumSize = useMediumSize(theme);
  const { imageSize, manual, imageFile, showResult } = useTopPageState();
  return (
    <>
      {isMediumSize ? (
        <>
          {imageSize ? (
            <div className={classes.root}>
              {showResult ? (
                <Result />
              ) : manual ? (
                <DrawCanvasSection />
              ) : (
                <Predict imageUrl={imageFile} />
              )}

              <Container className={classes.container}>
                <DropImageSection />
                <CalculateSection />
              </Container>
            </div>
          ) : (
            <DropImageSection />
          )}
        </>
      ) : (
        <>
          {imageSize ? (
            <Grid className={classes.grid}>
              <Grid.Col span={8} className={classes.gridCol}>
                {showResult ? (
                  <Result />
                ) : manual ? (
                  <DrawCanvasSection />
                ) : (
                  <Predict imageUrl={imageFile} />
                )}
              </Grid.Col>
              <Grid.Col span={4} className={classes.gridCol}>
                <Container className={classes.container}>
                  <DropImageSection />
                  <CalculateSection />
                </Container>
              </Grid.Col>
            </Grid>
          ) : (
            <DropImageSection />
          )}
        </>
      )}
    </>
  );
};
export default StateHandler;
