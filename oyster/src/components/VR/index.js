import {
  createStyles,
  // useMantineTheme,
} from '@mantine/core';

import { useTopPageState } from '../../hooks/useTopPageState';
// import { useMediumSize } from '../../styles/breakpoints';

const useStyles = createStyles((theme) => ({
  root: {
    margin: '0',
    padding: `${theme.spacing.xl}px ${theme.spacing.xl}px 0px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[0],
    [theme.fn.smallerThan('md')]: {
      padding: `${theme.spacing.sm}px ${theme.spacing.sm}px ${theme.spacing.sm}px`,
    },
  },
  container: {
    width: 500,
    height: 400,
    zIndex: 0,
    padding: theme.spacing.lg,
    [theme.fn.smallerThan('md')]: {
      width: 400,
      height: 400,
    },
  },
}));

const VR = () => {
  const { classes } = useStyles();
  // const theme = useMantineTheme();
  // const isMediumSize = useMediumSize(theme);
  const { model, scale } = useTopPageState();
  console.log(scale);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <a-scene embedded>
          <a-entity environment="preset: default" position="0 -3 0"></a-entity>
          <a-entity
            gltf-model={model?.predictions[0].url}
            position="5 1.5 -15"
            scale={`${scale} ${scale} ${scale}`}
            crossOrigin="anonymous"
          ></a-entity>
          <a-entity id="rig" movement-controls="fly: false;">
            <a-camera id="camera"></a-camera>
            <a-entity
              hand-controls="hand: left;"
              oculus-touch-controls="hand: left"
            ></a-entity>
            <a-entity
              hand-controls="hand: right;"
              oculus-touch-controls="hand: right"
            ></a-entity>
          </a-entity>
        </a-scene>
      </div>
    </div>
  );
};

export default VR;
