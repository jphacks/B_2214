import { Grid, createStyles, Container, useMantineTheme, Header, AppShell, Footer, Text } from '@mantine/core';
import { useEffect } from 'react';

import CalculateSection from '../../components/CalculateSection';
import DrawCanvasSection from '../../components/DrawCanvasSection';
import DropImageSection from '../../components/DropImageSection';
import { FooterLinks } from '../../components/FooterLinks/FooterLinks';
// import { Logo } from '../../components/Logo/logo';
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
  const { predictionImageSize, manual, showResult, smallImageFile, smallImageSize, largeImageFile, largeImageSize, setImageFile, setImageSize } = useTopPageState();

  useEffect(() => {
    if(isMediumSize){
      setImageFile(smallImageFile)
      setImageSize(smallImageSize)
    }else{
      setImageFile(largeImageFile)
      setImageSize(largeImageSize)
    }
  }, [isMediumSize]);

  return (
    <>
      <AppShell
        fixed={false}
        padding="sm"
        header={<Header height={60} p="xs">
          {/* <Logo></Logo> */}
          <Text
            component="span"
            align="center"
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
            size="30px"
            weight={700}
            style={{
               marginLeft: '20px',

              }}
          >まどりーだー</Text>
        </Header>}
        footer={<Footer height={175} >
          <FooterLinks links = {[{link:'https://github.com/jphacks/B_2214',label:'github repo'}]}></FooterLinks>
          </Footer>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colors.gray[0] },
        })}
      >
      {isMediumSize ? (
        <>
          {predictionImageSize ? (
            <div className={classes.root}>
              {showResult ? (
                <Result />
              ) : manual ? (
                <DrawCanvasSection />
              ) : (
                <Predict />
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
          {predictionImageSize ? (
            <Grid className={classes.grid}>
              <Grid.Col span={8} className={classes.gridCol}>
                {showResult ? (
                  <Result />
                ) : manual ? (
                  <DrawCanvasSection />
                ) : (
                  <Predict />
                )}
              </Grid.Col>
              <Grid.Col span={4} className={classes.gridCol}>
                <Container className={classes.container}>
                  <DropImageSection />
                  {showResult?<></>:<CalculateSection />}
                </Container>
              </Grid.Col>
            </Grid>
          ) : (
            <DropImageSection />
          )}
        </>
      )}
      </AppShell>
    </>
  );
};
export default StateHandler;
