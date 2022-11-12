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
    model,
    scale
  } = useTopPageState();
  console.log(scale);

  return (
    <div className={classes.root}>
      <div className={classes.vrcontainer}>
        <a-scene embedded>
            <a-entity environment="preset: default" position="0 -3 0"></a-entity>

            <a-entity
              gltf-model={model?.prediction[0].url}
              position= "0 2 -5"
              scale = {`${scale} ${scale} ${scale}`}
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
