import {
  createStyles,
//   useMantineTheme,
} from '@mantine/core';
// import { IconEraser } from '@tabler/icons';
// import { useEffect, useState } from 'react';

import { useTopPageState } from '../../hooks/useTopPageState';
// import { useMediumSize } from '../../styles/breakpoints';

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
  vrcontainer: {
    width: 1000,
    height: 500,
  },
}));

const VR = () => {
  const { classes } = useStyles();
//   const theme = useMantineTheme();
//   const isMediumSize = useMediumSize(theme);
  const {
    model
  } = useTopPageState();

  return (
    <div className={classes.root}>
      <div className={classes.vrcontainer}>
        <a-scene embedded>
            {/* <a-text value={pageName} position="0 25 -100" width="500" align="center" zOffset="1">{console.log(props.pageName)}</a-text> */}
            <a-entity environment="preset: default" position="0 -3 0"></a-entity>
            {/* <a-entity light=" intensity: 1.5" position="0 100 0"></a-entity> */}
            <a-box color="red" position="0 2 -5" rotation="0 45 45" scale="2 2 2"></a-box>

            <a-entity
              // gltf-model="test.gltf"
              gltf-model={model?.prediction[0].url}
              position= "0 2 -20"
              scale="0.05 0.05 0.05"
              crossOrigin="anonymous"
            ></a-entity>
            <a-entity id="rig" movement-controls="fly: false;">
                <a-camera id="camera"></a-camera>
                <a-entity hand-controls="hand: right; handModelStyle: lowPoly; color: #ffcccc"></a-entity>
                <a-entity hand-controls="hand: left; handModelStyle: lowPoly; color: #ffcccc"></a-entity>
            </a-entity>

            {/* <a-entity id="player" movement-controls="fly: false;">
                <a-entity id="camera" camera wasd-controls look-controls position="0 1.6 0"></a-entity>
                <a-entity id="left-hand"
                    hand-controls="hand: left;"
                    oculus-touch-controls="hand: left"
                    vive-controls="hand: left"
                    microsoft-motion-controls="hand: left"
                    daydream-controls="left"
                    gearvr-controls="left"
                ></a-entity>
                <a-entity id="right-hand"
                    hand-controls="hand: right;"
                    oculus-touch-controls="hand: right"
                    vive-controls="hand: right"
                    microsoft-motion-controls="hand: right"
                    daydream-controls="right"
                    gearvr-controls="right"
                ></a-entity>
            </a-entity> */}
        </a-scene>
      </div>
    </div>
  );
};

export default VR;
