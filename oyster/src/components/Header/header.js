import { createStyles, Container, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: theme.breakpoints.xl,
    margin: '0',
    padding: `${theme.spacing.xl}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[0],
    [theme.fn.smallerThan('md')]: {
      padding: `${theme.spacing.md}px ${theme.spacing.sm}px  ${theme.spacing.sm}px`,
    },
  },
  container: {
    height: '50vh',
    width: '50vw',
    backgroundColor: theme.colors.blue[0],
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: theme.radius.md,
    color: theme.colors.blue[6],
    fontWeight: '700',
    fontSize: theme.fontSizes.xl,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.blue[1],
    },
    [theme.fn.smallerThan('md')]: {
      padding: theme.spacing.sm,
      width: '80vw',
    },
  },
}));

const Header = () => {
  const { classes } = useStyles();


  return (
    <div className={classes.root}>
        <Container className={classes.container}>
            <Text>oyster</Text>
        </Container>
    </div>
  );
};

export default Header;
