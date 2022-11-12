import {
  Button,
  createStyles,
  NumberInput,
  SegmentedControl,
  Container,
} from '@mantine/core';
import { IconCalculator } from '@tabler/icons';

import { useTopPageState } from '../../hooks/useTopPageState';

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.gray[0],
    margin: '0',
    padding: theme.spacing.lg,
    [theme.fn.smallerThan('md')]: {
      padding: `0px ${theme.spacing.sm}px ${theme.spacing.md}px`,
    },
    gap: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.md,
  },
  numberInput: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const CaluculateSection = () => {
  const { classes } = useStyles();
  const {
    pixelArea,
    inputArea,
    setInputArea,
    options,
    setScale,
    selectedMetric,
    setSelectedMetric,
    showResult,
    setShowResult,
    manual,
  } = useTopPageState();

  const onClickCalc = () => {
    if (selectedMetric === 'm2') {
      setScale(Math.sqrt(inputArea / pixelArea));
      console.log(inputArea / pixelArea);
    } else {
      setScale(Math.sqrt((1.62 * inputArea) / pixelArea));
      console.log((1.62 * inputArea) / pixelArea);
    }
    setShowResult(true);
  };

  return (
    <Container className={classes.container}>

      <div className={classes.numberInput}>
        <NumberInput
          type="number"
          placeholder={manual?"囲んだ部分の面積":"専有面積"}
          value={inputArea}
          withAsterisk
          min={0}
          precision={1}
          step={0.1}
          disabled={showResult}
          // error="input number"
          onChange={(inputArea) => setInputArea(inputArea)}
        />
        <SegmentedControl
          data={[
            { value: options[0].value, label: options[0].text },
            { value: options[1].value, label: options[1].text },
          ]}
          value={selectedMetric}
          disabled={showResult}
          onChange={setSelectedMetric}
          color="blue"
        />
      </div>
      <Button
        size="xl"
        color="blue"
        radius="lg"
        rightIcon={<IconCalculator />}
        disabled={!(inputArea && pixelArea) || showResult}
        onClick={onClickCalc}
      >
        Calc
      </Button>
    </Container>
  );
};

export default CaluculateSection;
