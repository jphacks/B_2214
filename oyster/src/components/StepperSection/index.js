import { createStyles, Stepper, useMantineTheme } from '@mantine/core';

import { useMediumSize } from '../../styles/breakpoints';

const useStyles = createStyles((theme) => ({
  // root: {
  //   width: '100%',
  //   maxWidth: theme.breakpoints.xl,
  //   margin: '0',
  //   padding: `${theme.spacing.xl}px ${theme.spacing.xl}px ${theme.spacing.md}px`,
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: theme.colors.gray[0],
  //   [theme.fn.smallerThan('md')]: {
  //     padding: `${theme.spacing.md}px ${theme.spacing.sm}px ${theme.spacing.md}px`,
  //   },
  // },
  stepContainer: {
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
  },
  step: {
    minHeight: '0px',
  },
}));

const StepperSection = (props) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMediumSize = useMediumSize(theme);
  const { stepNumber } = props;

  return (
    <div className={classes.stepContainer}>
      <Stepper
        orientation={isMediumSize ? 'vertical' : 'horizontal'}
        size="md"
        active={stepNumber}
        color="blue"
      >
        <Stepper.Step
          label="Step 1"
          description="Upload Image"
          className={classes.step}
        />
        <Stepper.Step
          label="Step 2"
          description="Surround Image and Input Area"
          className={classes.step}
        />
        <Stepper.Step
          label="Step 3"
          description="Click Two Points"
          className={classes.step}
        />
      </Stepper>
    </div>
  );
};

export default StepperSection;
